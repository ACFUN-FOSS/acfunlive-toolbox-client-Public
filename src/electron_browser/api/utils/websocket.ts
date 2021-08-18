import { toANY } from "@/electron_browser/util_function/type";
import { randomId } from "@front/util_function/base";
const baseUrl =
	process.env.NODE_ENV === "production"
		? window.location.hostname
		: "localhost";

export const wsStatus: any = {
	url: `ws://${baseUrl}:15368`,
	ws: null,
	timeout: 5000,
	online: false
};

export const wsPromise = (
	method: string,
	data: any = {},
	timeoutD = 12000
): Promise<any> => {
	return new Promise((resolve, reject) => {
		if (!wsStatus.ws || wsStatus.ws.readyState !== 1) {
			reject(new Error("serve not started!"));
			return;
		}
		const requestID = String(randomId(10));
		const timeout = setTimeout(() => {
			wsStatus.ws?.removeEventListener("message", judge);
			if (data.type !== 2) {
				reject(
					new Error(`${method} timeout!,data:${JSON.stringify(data)}`)
				);
			}
		}, timeoutD);
		const judge = (e: any) => {
			const data = JSON.parse(e.data);
			if (data.requestID === requestID) {
				if (data.result === 13) {
					reject(new Error(data.error));
					return;
				}
				if (data.error) {
					reject(new Error(data.error));
				}
				if (data.type !== 1) {
					console.log(`======res===${method}=====`);
					console.log(data);
				}
				clearTimeout(timeout);
				resolve(data.data);
				wsStatus.ws?.removeEventListener("message", judge);
			}
		};
		wsStatus.ws.addEventListener("message", judge);
		if (data.type !== 2) {
			console.log(`======send===${method}=====`);
			console.log(data);
		}
		const role = toANY(window).role || "无";
		wsStatus.ws.send(JSON.stringify({ role, ...data, requestID }));
	});
};
