import { wsPromise } from "@front/api/utils/websocket";

export const catrgory = (): Promise<any> => {
	// 获取直播分区
	return wsPromise("getCategory", {
		type: 901
	});
};
