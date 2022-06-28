import { randomId } from "@front/util_function/base";
import { ElMessage } from "element-plus";

export const isOnline = (): Promise<boolean> => {
	return new Promise(resolve => {
		const timer = setTimeout(() => {
			resolve(false);
		}, 3000);
		getWs(undefined).onopen = () => {
			clearTimeout(timer);
			resolve(true);
		};
	});
};

/**
 * @name ws链接
 * @returns String
 */
export const getUrl = (): string => {
	return process.env.NODE_ENV === "production"
		? window.location.hostname
		: "localhost";
};

export const setHeartBeat = (ws: any, options: any = {}) => {
	if (!ws) return;
	const { once }: any = options;
	clearTimeout(ws.timer);
	console.log("心跳");
	if (ws.readyState === 1) {
		ws.send(
			JSON.stringify({
				role: "工具箱",
				type: 1
			})
		);
	}
	if ([2, 3].includes(ws.readyState)) {
		clearTimeout(ws.timer);
		return;
	}
	if (once) return;
	ws.timer = setTimeout(() => {
		setHeartBeat(ws);
	}, 3000);
};

export const getWs = (ip: string | undefined): WebSocket => {
	return new WebSocket(`ws://${ip || getUrl()}:15368`);
};

export const getOpenedWs = (): Promise<WebSocket> => {
	return new Promise((resolve, reject) => {
		const ws = getWs(undefined);
		ws.onopen = () => {
			resolve(ws);
		};
		ws.onerror = () => {
			reject(ws);
		};
	});
};

// 发送打印黑名单，1：心跳
const ignoreSendList = [1, 6];
// 接受打印黑名单,2:登陆
const ignoreReceiveList = [2, 6, 200];
// 错误日志名单 10：请求的json解析错误 11：请求type无效 12：请求data无效 13：处理请求时出现错误 14：需要登陆
const errorList = [10, 11, 12, 13, 14];

const ignoreInProduction = [3, 4, 5, 109, 102];
if (process.env.NODE_ENV === "production") {
	ignoreSendList.push(...ignoreInProduction);
	ignoreReceiveList.push(...ignoreReceiveList);
}
/**
 * @name 发送ws请求 参考 https://github.com/ACFUN-FOSS/acfunlive-backend/blob/main/doc/%E5%90%8E%E7%AB%AFWebSocket%E6%8E%A5%E5%8F%A3.md
 * @param method 请求名称，只用于做标识 实际请求放在data.type里
 * @param data
 * @param timeout 超时时间
 * @param once 请求完后是否关闭ws
 * @param ws 是否复用ws
 * @returns Promise<Object>
 */
export const request = ({
	method,
	data,
	timeout,
	once,
	hideMsg,
	print,
	ws,
	ip
}: any): Promise<any> => {
	timeout = timeout || 12000;

	if (once === undefined) {
		once = true;
	}
	if (print === undefined) {
		print = true;
	}
	return new Promise((resolve, reject) => {
		if (!ws) {
			ws = getWs(ip);
		}
		const requestID = String(randomId(10));
		const timer = setTimeout(() => {
			ws.removeEventListener("message", judge);
			ws.close();
			if (!ignoreSendList.includes(data.type) && !hideMsg) {
				ElMessage.error(`${method} 请求超时`);
			}
			reject(
				new Error(`${method} timeout!,data:${JSON.stringify(data)}`)
			);
		}, timeout);
		const judge = (e: any) => {
			clearTimeout(timer);
			const data = JSON.parse(e.data);
			if (data.requestID === requestID) {
				if (errorList.includes(data.result) && !hideMsg) {
					if (!ignoreReceiveList.includes(data.type)) {
						ElMessage.error(`${method} 请求失败： ${data.error}`);
					}
					reject(new Error(JSON.stringify(data)));
					return;
				}
				if (
					!ignoreReceiveList.includes(data.type) &&
					print &&
					!hideMsg
				) {
					console.log(`======res===${method}=====`);
					console.log(data);
				}
				const result = data.data || {};
				if (once) {
					ws.close();
					resolve(result);
				} else {
					resolve({
						...result,
						ws
					});
				}
			}
		};
		ws.addEventListener("message", judge);
		const open = () => {
			const role = (window as any).role || "无";
			if (!ignoreSendList.includes(data.type) && print && !hideMsg) {
				console.log(`======send===${method}=====`);
				console.log(data);
			}
			ws.send(JSON.stringify({ role, ...data, requestID }));
		};
		if (ws.readyState !== 1) {
			ws.onopen = open;
		} else {
			open();
		}
	});
};
