import { user } from "@front/datas";
import { sleep } from "@front/util_function/base";
import { wsPromise } from "@front/api/utils/websocket";
import { reject } from "lodash";
export const login = (data: user.Session | any): Promise<any> => {
	// 登陆
	return wsPromise("login", {
		type: 2,
		data
	});
};

export const streamInfo = ({ userID }: any): Promise<any> => {
	// 获取用户直播信息
	return wsPromise("getUserStreamInfo", {
		type: 109,
		data: {
			userID
		}
	});
};

export const isStreaming = ({ userID }: any): Promise<any> => {
	// 获取用户直播信息
	return wsPromise("getUserStreamInfo", {
		type: 115,
		data: {
			userID
		}
	});
};
/* eslint-disable */
export const checkIsStreaming = ({ userID }: any): Promise<any> => {
	return new Promise(async (resolve, reject) => {
		let isStreaming = undefined;
		let data = undefined;
		let retry = 0;
		do {
			try {
				data = await streamInfo({ userID });
				if (!data?.profile) {
					throw new Error();
				}
				isStreaming = Boolean(data.liveID);
			} catch (error) {
				retry += 1;
				await sleep(1000);
				if (retry > 10) {
					reject(new Error("retry to maxmium!"));
					return;
				}
			}
		} while (isStreaming === undefined);
		resolve({
			isStreaming,
			data
		});
	});
};
