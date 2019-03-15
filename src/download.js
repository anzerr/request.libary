
const http = require('http'),
	https = require('https'),
	fs = require('fs'),
	url = require('url');

module.exports = (u, path) => {
	let file = fs.createWriteStream(path);
	return new Promise((resolve) => {
		let a = url.parse(u);
		((a.protocol === 'https:') ? https : http).get(a, (response) => {
			response.pipe(file);
			file.on('close', () => {
				resolve(path);
			});
		});
	});
};
