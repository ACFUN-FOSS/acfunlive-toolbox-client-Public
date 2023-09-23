import { session, requestT, login } from "@front/api/user";
import { setHeartBeat } from "@front/api/utils/websocket";
import { user } from "@front/datas";
import { throttle } from "lodash";
let starting = false;
export const startDanmaku = ({ onOpen, onDanmaku, onClose }: any): any => {
	if (starting) {
		return Promise.reject(new Error("processing!"));
	}
	starting = true;
	//@ts-ignore
	const ws: any = window?.danmakuWS;
	if (ws) {
		ws.onclose = null;
		ws.close();
	}
	// 开始弹幕流获取
	return start(session)
		.then(res => {
			let timer: any = null;
			const { ws }: any = res;
			const heartBeat = throttle(function() {
				setHeartBeat(ws, { once: true });
			}, 5000);
			(window as any).danmakuWS = ws;
			heartBeat();
			const judge = (e: any) => {
				const data = JSON.parse(e.data);
				if (data.type !== 1) {
					heartBeat();
					clearTimeout(timer);
					timer = setTimeout(onClose, 10000);
				}
				ws.onclose = onClose;
				if ([2999, 101, 2000].includes(data.type)) {
					console.log("danmaku flow end!");
					ws.close();
					return;
				}
				if (data.type >= 1000) {
					if (onDanmaku) onDanmaku(data);
				}
			};
			ws.addEventListener("message", judge);
			if (onOpen) onOpen(res);
		})
		.catch(err => {
			console.error(err);
			if (onClose) onClose();
			throw new Error(err);
		})
		.finally(() => {
			starting = false;
		});
};

export const start = async (data: user.Session): Promise<any> => {
	const tokenInfo = await login({ account: "", password: "" }, true);
	// 开始弹幕获取
	return requestT({
		method: "startDanmakuFlow",
		data: {
			type: 100,
			data: {
				liverUID: data.userID
			}
		},
		timeout: 20000,
		once: false,
		tokenInfo,
		ip: "localhost"
	}).catch(() => {
		return Promise.reject(new Error("startDanmakuFlow Failed!"));
	});
};
