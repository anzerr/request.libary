
const http = require('http'),
	https = require('https'),
	fs = require('fs'),
	url = require('url');

module.exports = (u, path, force = false) => {
	return new Promise((resolve, reject) => {
		const a = url.parse(u);
		let req = ((a.protocol === 'https:') ? https : http).get(u, (response) => {
			if (Math.floor(response.statusCode / 100) === 2 || force) {
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
