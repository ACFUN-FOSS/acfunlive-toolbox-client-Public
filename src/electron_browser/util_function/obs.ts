const OBSWebSocket = require("obs-websocket-js");

interface streamSettings {
	server: string;
	key: string;
}

export class OBS {
	obs = null;
	constructor() {
		this.connect();
	}

	connect() {
		return new Promise((resolve, reject) => {
			let obs: any = this.obs;
			this.obs = null;
			obs = new OBSWebSocket();
			obs.on("error", (e: any) => {
				console.log("socket error:", e);
			});
			obs.connect()
				.then(() => {
					this.obs = obs;
					resolve(obs);
				})
				.catch((e: Error) => {
					reject(e);
				});
		});
	}

	send(requestName: string, args?: any) {
		return this.connect()
			.then((obs: any) => {
				return obs.send(requestName, args);
			})
			.catch((e: any) => {
				return e;
			});
	}

	setStreamSettings(settings: streamSettings) {
		return this.send("SetStreamSettings", {
			type: "rtmp_custom",
			settings
		});
	}

	startStream() {
		return this.send("StartStreaming");
	}

	stopStream() {
		return this.send("StopStreaming");
	}

	checkStatus() {
		return this.send("GetStreamingStatus");
	}
}

export default new OBS();
