import { requestT } from "@front/api/user";

export const catrgory = (): Promise<any> => {
	// 获取直播分区
	return requestT({
		method: "getCategory",
		data: {
			type: 901
		}
	});
};
