import { user } from "@front/datas";
import { wsPromise } from "@front/api/utils/websocket";
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
