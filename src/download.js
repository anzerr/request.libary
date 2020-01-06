
const http = require('http'),
	https = require('https'),
	fs = require('fs'),
	url = require('url');

module.exports = (u, path) => {
	const file = fs.createWriteStream(path);
	return new Promise((resolve, reject) => {
		const a = url.parse(u);
		console.log(u);
		((a.protocol === 'https:') ? https : http).get(u, (response) => {
			file.on('error', (err) => reject(err));
			file.on('close', () => resolve(path));
			response.pipe(file);
		}).on('error', (err) => reject(err));
	});
};
