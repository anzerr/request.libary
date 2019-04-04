'use strict';

const querystring = require('querystring');

class Response {

	constructor(request, data) {
		this._request = request;
		this._data = data;
	}

	headers(key) {
		let h = this._request.headers || {};
		if (key) {
			return h[key];
		}
		return h;
	}

	status() {
		return Number(this._request.statusCode) || 0;
	}

	isStatus(n) {
		return (Math.floor(this.status() / 100) === n);
	}

	isOkay() {
		return this.isStatus(2);
	}

	body() {
		return this._data;
	}

	parse() {
		let content = this.headers()['content-type'] || '';
		if (content && content.match('json')) {
			try {
				return JSON.parse(this._data.toString());
			} catch(e) {
				return this._data;
			}
		}
		if (content && content.match('application/x-www-form-urlencoded')) {
			return querystring.parse(this._data.toString());
		}
		return this._data;
	}

}

module.exports = Response;
