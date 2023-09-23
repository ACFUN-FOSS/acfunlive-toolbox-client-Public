import { user } from "@front/datas";
import { request } from "@front/api/utils/websocket";

let logined = false;
export let session: any = null;
export const isLogined = (): boolean => {
	return logined;
};

/**
 * @name 登陆
 * @param param
 * @param param.account 账号
 * @param param.password 密码
 * @returns
 */
export const login = (
	{ account, password }: user.Data,
	isVisitor = false
): Promise<any> => {
	// 登陆
	return request({
		method: "login",
		timeout: 50000,
		data: {
			type: 2,
			data: {
				account,
				password
			}
		}
	})
		.then(({ tokenInfo }: any) => {
			if (!isVisitor) {
				session = tokenInfo;
				logined = true;
			}
			return Promise.resolve(tokenInfo);
		})
		.catch(e => {
			logined = false;
			session = null;
			return Promise.reject(e);
		});
};
export const loginSession = (tokenInfo: any): void => {
	session = tokenInfo;
	logined = true;
};

/**
 * @name 无需登陆设置token
 * @returns 有token的websocket
 */
export const setToken = ({
	ip,
	timeout,
	tokenInfo
}: any): Promise<WebSocket> => {
	if ((!session && !tokenInfo) || !logined) {
		return Promise.reject(new Error());
	}

	return request({
		method: "setToken",
		data: {
			type: 6,
			data: tokenInfo || session
		},
		ip,
		timeout,
		once: false,
		print: false
	});
};

/**
 * @name 带token的请求
 * @returns
 */
export const requestT = ({
	method,
	data,
	timeout,
	once,
	ip,
	tokenInfo
}: any) => {
	return setToken({ ip, tokenInfo, timeout: 5000 }).then(({ ws }: any) => {
		return request({ method, data, timeout, once, ws, ip });
	});
};

export const streamInfo = ({ userID }: any): Promise<any> => {
	// 获取用户直播信息
	return requestT({
		method: "getUserStreamInfo",
		data: {
			type: 109,
			data: {
				userID
			}
		}
	});
};

export const isStreaming = ({ userID }: any): Promise<any> => {
	// 获取用户直播信息
	return requestT({
		method: "isStreaming",
		data: {
			type: 115,
			data: {
				userID
			}
		}
	});
};
