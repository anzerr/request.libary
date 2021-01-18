
const Require = require('./index.js'),
	fs = require('fs'),
	http = require('http'),
	assert = require('assert'),
	crypto = require('crypto'),
	path = require('path');

const hash = (buf) => {
	const h = crypto.createHash('sha256');
	h.update(buf);
	return h.digest('hex');
};

const wrap = (p) => {
	return p.then(() => console.log('done'));
};

/* eslint no-sync: 0 */
const f = path.join(__dirname, 'test.data');
wrap(Require.download('https://raw.githubusercontent.com/anzerr/request.libary/master/LICENSE', f).then((res) => {
	assert.equal(hash(fs.readFileSync(f)), hash(fs.readFileSync('LICENSE')));
	assert.equal(f, res);
	fs.unlinkSync(f);
}).catch((e) => {
	fs.unlinkSync(f);
	console.log(e);
}));

const f2 = path.join(__dirname, 'test.data');
wrap(Require.download(`http://localhost:${Math.floor(Math.random() * 5000) + 2000}`, f2).then((res) => {
	throw new Error('should fail');
}).catch((err) => {
	assert.equal(err.toString().match('should fail'), null);
}));

const server = http.createServer((req, res) => {
	console.log(req.method);
	if (req.method === 'GET') {
		res.writeHead(404, {});
		res.end('cat');
	}
}).listen(1358, () => {
	Require.download('http://localhost:1358', f2).then(() => {
		throw new Error('should fail');
	}).catch((err) => {
		assert.notEqual(err.toString().match('cound not download file status code error'), null);
	}).then(() => {
		return new Require('http://localhost:1358').options({
			timeout: 3000
		}).post().then(() => {
			throw new Error('should fail');
		}).catch((err) => {
			assert.notEqual(err.toString().match('socket hang up'), null);
		});
	}).then(() => {
		server.close();
	});
});

wrap(new Require('https://api.github.com').headers({
	'user-agent': 'http://developer.github.com/v3/#user-agent-required'
}).get().then((res) => {
	assert.equal(res.isOkay(), true);
	assert.equal(typeof res.parse(), 'object');
	assert.equal(Buffer.isBuffer(res.body()), true);
	assert.equal(typeof res.body().toString(), 'string');
	assert.equal(res.headers()['content-type'], 'application/json; charset=utf-8');
	assert.deepEqual(JSON.parse(res.body().toString()), res.parse());
}));

wrap(new Require('google.com').options({redirect: false}).get().then((res) => {
	assert.equal(res.isStatus(3), true);
	assert.equal(res.status(), 301);
}));

wrap(new Require('google.com').get().then((res) => {
	assert.equal(res.isOkay(), true);
	assert.equal(res.isStatus(2), true);
}));
