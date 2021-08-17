import { wsPromise, wsStatus } from "@front/api/utils/websocket";
import { user } from "@front/datas";
import { event } from "@front/util_function/eventBus";
let pending = false;
let currentWs: any = null;
export const startDanmaku = (
	session: user.Session,
	{ startCallback, danmakuCallback, endCallback, errorCallback }: any
): any => {
	if (pending) {
		return;
	}
	pending = true;
	// @ts-ignore
	const ws = window.wsl;
	// 开始弹幕流获取
	return start(session)
		.then(res => {
			const judge = (e: any) => {
				const data = JSON.parse(e.data);
				if ([2999, 101, 2000].includes(data.type)) {
					ws?.removeEventListener("message", judge);
					currentWs = null;
					if ([2999].includes(data.type)) {
						console.error("danmaku flow error!");
						if (errorCallback) errorCallback();
					}
					if ([2000, 101].includes(data.type)) {
						console.log("danmaku flow end!");
						if (endCallback) endCallback();
					}
					return;
				}
				if (data.type >= 1000) {
					if (danmakuCallback) danmakuCallback(data);
				}
			};
			if (ws !== currentWs && res) {
				ws.addEventListener("message", judge);
				currentWs = ws;
			}

			if (startCallback) startCallback(res);
		})
		.catch(err => {
			console.error(err);
			pending = false;
			if (errorCallback) errorCallback();
			throw new Error(err);
		})
		.finally(() => {
			pending = false;
		});
};

export const start = (data: user.Session): Promise<void> => {
	// 开始弹幕获取
	return wsPromise(
		"startDanmakuFlow",
		{
			type: 100,
			data: {
				liverUID: data.userID
			}
		},
		12000
	);
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
