import { wsPromise, wsStatus } from "@front/api/utils/websocket";
import { user } from "@front/datas";
import { event } from "@front/util_function/eventBus";
let pending = false;
let currentWs: any = null;
export const startDanmaku = (
	session: user.Session,
	{ startCallback, danmakuCallback, endCallback }: any
): void => {
	if (pending) {
		return;
	}
	pending = true;
	// @ts-ignore
	const ws = window.wsl;
	// 开始弹幕流获取
	start(session)
		.then(res => {
			const judge = (e: any) => {
				const data = JSON.parse(e.data);
				if (data.type === 101 || data.type === 2000) {
					console.log("danmaku flow end!");
					ws.removeEventListener("message", judge);
					currentWs = null;
					if (endCallback) endCallback();
					return;
				}
				if (data.type >= 1000) {
					if (danmakuCallback) danmakuCallback(data);
				}
			};
			if (ws !== currentWs) {
				ws.addEventListener("message", judge);
				currentWs = ws;
			}

			if (startCallback) startCallback(res);
		})
		.catch(err => {
			pending = false;
			throw new Error(err);
		})
		.finally(() => {
			pending = false;
		});
};

export const start = (data: user.Session): Promise<void> => {
	// 开始弹幕获取
	return wsPromise("startDanmakuFlow", {
		type: 100,
		data: {
			liverUID: data.userID
		}
	});
};
export const stop = (data: user.Session): Promise<void> => {
	// 结束弹幕获取
	return wsPromise("stopDanmakuFlow", {
		type: 101,
		data: {
			liverUID: data.userID
		}
	});
};
