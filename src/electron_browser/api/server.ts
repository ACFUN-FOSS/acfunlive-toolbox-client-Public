import { wsStatus as status } from "./utils/websocket";
import { toANY } from "@front/util_function/type";

let heartbeat: any = null;
let ready = 0;
export const isOnline = (): boolean => {
	return toANY(window).wsl?.readyState === 1;
};
export const isConnecting = (): boolean => {
	return toANY(window).wsl?.readyState === 0;
};

export const heartBeat = (): void => {
	console.log("====心跳=====");
	status.ws.send(
		JSON.stringify({
			type: 1
		})
	);
};
export const startHeatBeat = (): void => {
	clearTimeout(heartbeat);
	if (isOnline()) {
		heartBeat();
	}
	heartbeat = setTimeout(() => {
		startHeatBeat();
	}, 3000);
};
export const init = ({ onOpen, onClose }: any) => {
	startHeatBeat();
	if (!isOnline() && !isConnecting()) {
		try {
			toANY(window).wsl.close();
		} catch (error) {}
		toANY(window).wsl = status.ws = new WebSocket(status.url);
		status.ws.onopen = () => {
			status.online = true;
			ready = 1;
			onOpen();
		};
		status.ws.onclose = () => {
			status.online = false;
			// @ts-ignore
			status.ws = window.wsl = null;
			if (ready) {
				ready = 0;
				onClose();
			}
		};
		status.ws.onerror = () => {
			status.online = false;
		};
		status.ws.onmessage = (e: any) => {
			// console.log(e.data);
		};
	}
};
