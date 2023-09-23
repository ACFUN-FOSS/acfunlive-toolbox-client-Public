import OBSWebSocket from "obs-websocket-js";

interface streamSettings {
	server: string;
	key: string;
}

export class OBS {
	obs: any = null;
	constructor() {
		this.connect();
	}

	clearObs() {
		this.obs = null;
	}

	connect() {
		return new Promise((resolve, reject) => {
			if (this.obs) {
				resolve(this.obs);
				return;
			}
			const obs = new OBSWebSocket();
			obs.on("ConnectionClosed", this.clearObs);
			obs.on("ConnectionError", this.clearObs);
			obs.connect()
				.then((res: any) => {
					this.obs = obs;
					resolve(res);
				})
				.catch((e: Error) => {
					reject(e);
				});
		});
	}

	disconnect() {
		this.obs.disconnect();
		this.clearObs();
	}

	getStreamStatus() {
		return this.reply("GetStreamStatus");
	}

	reply(command: string, params = {}) {
		return new Promise((resolve, reject) => {
			this.obs
				.call(command, params)
				.then(resolve)
				.catch(reject);
		});
	}

	setStreamSettings(settings: streamSettings) {
		return this.reply("SetStreamServiceSettings", {
			streamServiceType: "rtmp_custom",
			streamServiceSettings: {
				...settings,
				bwtest: false,
				use_auth: false
			}
		});
	}

	startStream() {
		return this.reply("StartStream");
	}

	stopStream() {
		return this.reply("StopStream");
	}

	checkStatus() {
		return this.reply("GetStreamStatus");
	}
}

export default new OBS();
