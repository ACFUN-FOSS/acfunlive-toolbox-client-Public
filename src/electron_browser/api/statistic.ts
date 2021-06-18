import { wsPromise } from "@front/api/utils/websocket";

export const getCurrentStastic = ({ liveID }: any): Promise<any> => {
	// 获取直播分区
	return wsPromise("getCurrentStastic", {
		type: 104,
		data: {
			liveID
		}
	});
};
