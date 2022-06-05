import { requestT } from "@front/api/user";

export const getCurrentStastic = ({ liveID }: any): Promise<any> => {
	// 获取直播分区
	return requestT({
		method: "getCurrentStastic",
		data: {
			type: 104,
			data: {
				liveID
			}
		}
	});
};
