'use strict';

const https = require('https'),
	http = require('http'),
	url = require('url'),
	querystring = require('querystring'),
	Response = require('./response.js'),
	download = require('./download.js');

class Request {

	constructor(u) {
		let base = u;
		if (!base.match(/^https*\:\/\//)) {
			base = 'http://' + base;
		}
		this.host = base;
		this.url = url.parse(base);
		this._headers = {};
		this._options = {};
		this._data = {
			query: null,
			value: null,
			type: null
		};
	}

	_request(method, u = '') {
		return new Promise((resolve, reject) => {
			const isHttps = (this.url.protocol === 'https:'), option = {
				method: method || 'GET',
				hostname: this.url.hostname,
				port: this.url.port || (isHttps ? 443 : 80),
				path: (this.url.pathname + u).replace(/\/{2,}/g, '/'),
				headers: this._headers || {}
			};
			for (let i in this._options) {
				option[i] = this._options[i];
			}
			if (this._data.query) {
				option.path += '?' + this._data.query;
			}

			let req = (isHttps ? https : http).request(option, (res) => {
				let chunks = [];

				res.on('data', (chunk) => {
					chunks.push(chunk);
				}).on('end', () => {
					resolve(new Response(res, Buffer.concat(chunks)));
				});
			});

			req.on('error', (err) => {
				reject(err);
			});

			if (this._data.value) {
				req.write(this._data.value);
			}
			req.end();
		}).then((res) => {
			if (res.isStatus(3) && this._options.redirect !== false) {
				let n = new Request(res.headers().location);
				n._headers = this._headers;
				n._options = this._options;
				n._data = this._data;
				return n._request(method, '');
			}
			return res;
		});
	}

	query(data) {
		this._data.query = querystring.stringify(data);
		return this;
	}

	json(data) {
		this.data(JSON.stringify(data))._data.type = 'json';
		this.headers({
			'Content-Length': this._data.value.length,
			'Content-Type': 'application/json'
		});
		return this;
	}

	form(data) {
		this.data(querystring.stringify(data))._data.type = 'form';
		this.headers({
			'Content-Length': this._data.value.length,
			'Content-Type': 'application/x-www-form-urlencoded'
		});
		return this;
	}

	data(data) {
		this._data.value = Buffer.isBuffer(data) ? data : Buffer.from(data);
		return this;
	}

	options(data) {
		for (let i in data) {
			this._options[i] = data[i];
		}
		return this;
	}

	headers(data) {
		for (let i in data) {
			this._headers[i.toLowerCase()] = data[i];
		}
		return this;
	}

	get(u) {
		return this._request('get', u || '');
	}

	post(u) {
		return this._request('post', u || '');
	}

	put(u) {
		return this._request('put', u || '');
	}

	delete(u) {
		return this._request('delete', u || '');
	}

}

Request.download = download;

module.exports = Request;
