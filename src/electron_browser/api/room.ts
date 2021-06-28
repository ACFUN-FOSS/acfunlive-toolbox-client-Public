import { wsPromise } from "@front/api/utils/websocket";
import { room, user } from "@front/datas";
export const setProfile = (data: any): Promise<any> => {
	// 修改房间图片信息
	return wsPromise("setRoomProfile", {
		type: 907,
		data
	});
};

export const getProfile = (): Promise<any> => {
	return wsPromise("getRoomProfile", {
		type: 903
	});
};

export const getRank = (data: user.Session): Promise<any> => {
	return wsPromise("getBoss", {
		type: 302,
		data: {
			liverUID: data.userID
		}
	});
};

export const getGift = (): Promise<any> => {
	return wsPromise("getGift", { type: 107 });
};

export const getDonate = (data: user.Session): Promise<any> => {
	return wsPromise("getDonate", {
		type: 103,
		data: {
			liverUID: data.userID
		}
	});
};

export const getAudience = (data: room.Profile): Promise<any> => {
	return wsPromise("getAudience", {
		type: 102,
		data
	});
};

export const getManagerList = (): Promise<any> => {
	return wsPromise("getManagerList", {
		type: 200
	});
};

export const addManager = (userID: number): Promise<any> => {
	return wsPromise("addManager", {
		type: 201,
		data: {
			managerUID: userID
		}
	});
};
export const removeManager = (userID: number): Promise<any> => {
	return wsPromise("removeManager", {
		type: 202,
		data: {
			managerUID: userID
		}
	});
};
export const kickOutPerson = ({ userID, liveID }: any): Promise<any> => {
	return wsPromise("kickOutPerson", {
		type: 205,
		data: {
			kickedUID: userID,
			liveID
		}
	});
};
