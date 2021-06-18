export interface Status {
	step: string;
	avaliable: boolean;
	connected: boolean;
	underway: boolean;
	danmaku: boolean;
}
export const status = (): Status => {
	return {
		step: "offline",
		avaliable: true,
		connected: false,
		underway: false,
		danmaku: false
	};
};

export interface Session {
	streamName: string;
	streamPullAddress: string;
	streamPushAddress: Array<string>;
	panoramic: boolean;
	interval: number;
	rtmpServer: string;
	streamKey: string;
}

export const session = (): Session => {
	return {
		streamName: "",
		streamPullAddress: "",
		streamPushAddress: [],
		panoramic: false,
		interval: 5000,
		rtmpServer: "",
		streamKey: ""
	};
};

export interface Url {
	url: string;
	bitrate: number;
	qualityType: string;
	qualityName: string;
}

export const url = (): Url => {
	return {
		url: "",
		bitrate: 0,
		qualityType: "",
		qualityName: ""
	};
};

export interface Encodec {
	streamUrl: Url;
	resolution: string;
	frameRate: number;
	template: string;
}

export const encodec = (): Encodec => {
	return {
		streamUrl: url(),
		resolution: "",
		frameRate: 0,
		template: ""
	};
};
