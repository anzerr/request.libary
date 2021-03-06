
const http = require('http'),
	https = require('https'),
	fs = require('fs'),
	url = require('url');

const download = (u, path, force = false, options = {}) => {
	return new Promise((resolve, reject) => {
		const a = url.parse(u);
		let req = ((a.protocol === 'https:') ? https : http).get(u, options, (response) => {
			if (Math.floor(response.statusCode / 100) === 3) {
				if (response.headers.location) {
					req.abort();
					let loc = response.headers.location;
					if (loc.match(/^\//)) {
						loc = `${a.protocol}//${a.host}${loc}`;
					}
					return download(loc, path, force, options).then((r) => {
						resolve(r);
					}).catch((e) => {
						reject(e);
					});
				}
				reject(new Error('got a redirect but missing location'));
			} else if (Math.floor(response.statusCode / 100) === 2 || force) {
				const file = fs.createWriteStream(path);
				file.on('error', (err) => reject(err));
				file.on('close', () => resolve(path));
				response.pipe(file);
			} else {
				req.abort();
				reject(new Error(`cound not download file status code error "${response.statusCode}"`));
			}
		});
		req.on('error', (err) => reject(err));
	});
};

module.exports = download;
