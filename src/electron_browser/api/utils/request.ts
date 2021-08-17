import { get, post } from "./http";

class sApi {
	url = "";
	constructor(url: any) {
		this.url = url;
	}

	get(method: any, root: any, para: any) {
		return get(`/axiosApi/${root}/${method}`, para);
	}

	post(method: any, root: any, para: any) {
		return post(`/axiosApi/${root}/${method}`, para);
	}
}
export default sApi;
