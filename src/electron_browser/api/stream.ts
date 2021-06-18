import { wsPromise } from "@front/api/utils/websocket";

export const start = (data: any): Promise<any> => {
	// 获取用户直播信息
	return wsPromise("openStream", {
		type: 905,
		data
	});
};

export const close = (liveID: string): Promise<any> => {
	// 获取用户直播信息
	return wsPromise("closeStream", {
		type: 906,
		data: {
			liveID
		}
	});
};

export const validate = (): Promise<any> => {
	return wsPromise("checkStreamable", {
		type: 900
	});
};

export const session = (): Promise<any> => {
	// 获取推流设置
	return wsPromise("getStreamSession", {
		type: 902
	});
};

export const encodec = (streamName: string): Promise<any> => {
	// 获取转码信息
	return wsPromise("getStreamEncodec", {
		type: 904,
		data: {
			streamName
		}
	});
};
