'use strict';

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

	parsedBody() {
		let content = this.headers()['content-type'];
		if (content.match('application/json')) {
			return JSON.parse(this._data.toString());
		}
		throw new Error('unsupported format "' + content + '"');
	}

}

module.exports = Response;
