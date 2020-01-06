
declare class Response {

	headers(key?: string): {[key: string]: string};
	status(): number;
	isStatus(n: number): boolean;
	isOkay(): boolean;
	body(): any;
	parse(): any;

}

declare class Request {

	constructor(host: string);
	query(data: {[key: string]: string | number | boolean}): Request;
	json(data: any): Request;
	form(data: any): Request;
	data(data: string | Buffer): Request;
	options(data: {[key: string]: string | number | boolean}): Request;
	headers(data: {[key: string]: string | number}): Request;
	get(url: string): Promise<Response>;
	post(url: string): Promise<Response>;
	put(url: string): Promise<Response>;
	delete(url: string): Promise<Response>;
	static download(url: string, path: string): Promise<void>;

}

export default Request