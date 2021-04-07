import {
	get,
	post
} from "./http";

class sApi {
	constructor(url) {
		this.url = url;
	}

	get(method, root, para) {
		return get(`/axiosApi/${root}/${method}`, para);
	}

	post(method, root, para) {
		return post(`/axiosApi/${root}/${method}`, para);
	}
}
export default sApi;
