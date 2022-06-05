import { requestT } from "@front/api/user";

export const record = (data: any): Promise<any> => {
	// 获取用户直播信息
	return requestT({
		method: "getRecords",
		data: {
			type: 106,
			data
		}
	});
};

export const start = (data: any): Promise<any> => {
	// 获取用户直播信息
	return requestT({
		method: "openStream",
		data: {
			type: 905,
			data
		}
	});
};

export const close = (liveID: string): Promise<any> => {
	// 获取用户直播信息
	return requestT({
		method: "closeStream",
		data: {
			type: 906,
			data: {
				liveID
			}
		}
	});
};

export const validate = (): Promise<any> => {
	return requestT({
		method: "checkStreamable",
		data: {
			type: 900
		}
	});
};

export const session = (): Promise<any> => {
	// 获取推流设置
	return requestT({
		method: "getStreamSession",
		data: {
			type: 902
		}
	});
};

export const encodec = (streamName: string): Promise<any> => {
	// 获取转码信息
	return requestT({
		method: "getStreamEncodec",
		data: {
			type: 904,
			data: {
				streamName
			}
		}
	});
};
