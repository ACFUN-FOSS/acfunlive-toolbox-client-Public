import { user } from "./ws_h";
import selfMethods from "./selfMethods";
declare global {
	interface Window {
		wsl: any;
	}
}
export class WsApi {
	host = selfMethods.isElectron() ? "localhost" : window.location.hostname;
	url = `ws://${this.host}:15368`;
	ws: any = null;
	timeout = 5000;
	online = false;

	init(): Promise<any> {
		return new Promise((resolve, reject) => {
			if (!this.online) {
				window.wsl = this.ws = new WebSocket(this.url);
				this.ws.onopen = async () => {
					this.online = true;
					resolve(this.online);
				};
				this.ws.onclose = () => {
					this.online = false;
					this.ws = null;
					reject(this.online);
				};
				this.ws.onmessage = (e: any) => {
					// console.log(e.data);
				};
			} else {
				this.heartBeat();
				resolve(this.online);
			}
		});
	}

	login(data: user.session): Promise<any> {
		// 登陆
		return this.wsPromise("login", {
			type: 2,
			data
		});
	}

	getDanmaku(data: user.session, callback: any): void {
		// 开始弹幕流获取
		const judge = (e: any) => {
			const data = JSON.parse(e.data);
			if (data.type === 101) {
				console.log("danmaku flow end!");
				this.ws.removeEventListener("message", judge);
			}
			if (data.type >= 1000) {
				// console.log("======res========");
				// console.log(data.data);
				callback(data);
			}
		};
		this.ws.addEventListener("message", judge);
		this.ws.send(
			JSON.stringify({
				type: 100,
				data: {
					liverUID: data.userID
				}
			})
		);
	}

	stopDanmaku(data: user.session): Promise<void> {
		// 结束弹幕获取
		return this.wsPromise("stopDanmakuFlow", {
			type: 101,
			data: {
				liverUID: data.userID
			}
		});
	}

	getCategory(): Promise<void> {
		// 结束弹幕获取
		return this.wsPromise("getCategory", {
			type: 901
		});
	}

	getUserStreamInfo(data: user.session): Promise<any> {
		// 获取用户直播信息
		return this.wsPromise("getUserStreamInfo", {
			type: 109,
			data
		});
	}

	setRoomProfile(data: any): Promise<any> {
		// 修改房间图片信息
		return this.wsPromise("setRoomProfile", {
			type: 907,
			data
		});
	}

	openStream(data: any): Promise<any> {
		// 获取用户直播信息
		return this.wsPromise("openStream", {
			type: 905,
			data
		});
	}

	closeStream(liveID: string): Promise<any> {
		// 获取用户直播信息
		return this.wsPromise("closeStream", {
			type: 906,
			data: {
				liveID
			}
		});
	}

	checkStreamable(): Promise<any> {
		return this.wsPromise("checkStreamable", {
			type: 900
		});
	}

	getRoomProfile(): Promise<any> {
		return this.wsPromise("getRoomProfile", {
			type: 903
		});
	}

	getStreamSession(): Promise<any> {
		// 获取推流设置
		return this.wsPromise("getStreamSession", {
			type: 902
		});
	}

	getStreamEncodec(streamName: string): Promise<any> {
		// 获取转码信息
		return this.wsPromise("getStreamEncodec", {
			type: 904,
			data: {
				streamName
			}
		});
	}

	heartBeat() {
		console.log("====心跳=====");
		this.ws.send(
			JSON.stringify({
				type: 1
			})
		);
	}

	wsPromise(method: string, data: any = {}): Promise<any> {
		return new Promise((resolve, reject) => {
			if (!this.ws) {
				reject(new Error("serve not started!"));
			}
			const judge = (e: any) => {
				const data = JSON.parse(e.data);
				if (data.requestID === method) {
					console.log(`======res===${method}=====`);
					console.log(data.data);
					clearTimeout(timeout);
					resolve(data.data);
					this.ws.removeEventListener("message", judge);
				}
			};
			this.ws.addEventListener("message", judge);
			const timeout = setTimeout(() => {
				this.ws.removeEventListener("message", judge);
				reject(new Error(`${method} timeout!`));
			}, this.timeout);
			console.log(`======send===${method}=====`);
			console.log(data);
			this.ws.send(
				JSON.stringify({
					...data,
					requestID: method
				})
			);
		});
	}
}

export const api = new WsApi();
