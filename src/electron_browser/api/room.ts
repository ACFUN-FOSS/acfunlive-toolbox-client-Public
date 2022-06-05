import { requestT } from "@front/api/user";
import { room, user } from "@front/datas";
export const setProfile = (data: any): Promise<any> => {
	// 修改房间图片信息
	return requestT({
		method: "setRoomProfile",
		data: {
			type: 907,
			data
		}
	});
};

export const getProfile = (): Promise<any> => {
	return requestT({
		method: "getRoomProfile",
		data: {
			type: 903
		}
	});
};

export const getRank = (data: user.Session): Promise<any> => {
	return requestT({
		method: "getBoss",
		data: {
			type: 302,
			data: {
				liverUID: data.userID
			}
		}
	});
};

export const getGift = (): Promise<any> => {
	return requestT({
		method: "getGift",
		data: { type: 107 }
	});
};

export const getGiftList = ({ liveID }: any): Promise<any> => {
	return requestT({
		method: "getGiftList",
		data: {
			type: 114,
			data: {
				liveID
			}
		}
	});
};

export const getDonate = (data: user.Session): Promise<any> => {
	return requestT({
		method: "getDonate",
		data: {
			type: 103,
			data: {
				liverUID: data.userID
			}
		}
	});
};

export const getAudience = (data: room.Profile): Promise<any> => {
	return requestT({
		method: "getAudience",
		data: {
			type: 102,
			data
		}
	});
};

export const getManagerList = (): Promise<any> => {
	return requestT({
		method: "getManagerList",
		data: {
			type: 200
		}
	});
};

export const addManager = (userID: number): Promise<any> => {
	return requestT({
		method: "addManager",
		data: {
			type: 201,
			data: {
				managerUID: userID
			}
		}
	});
};
export const removeManager = (userID: number): Promise<any> => {
	return requestT({
		method: "removeManager",
		data: {
			type: 202,
			data: {
				managerUID: userID
			}
		}
	});
};

export const getCutStatus = (): Promise<any> => {
	return requestT({
		method: "getRecPermission",
		data: {
			type: 908
		}
	});
};

export const setCutStatus = (canCut = true): Promise<any> => {
	return requestT({
		method: "setCutStatus",
		data: {
			type: 909,
			data: { canCut }
		}
	});
};

export const toCut = (liverUID: number, liveID: string): Promise<any> => {
	return requestT({
		method: "toCut",
		data: {
			type: 116,
			data: { liverUID, liveID }
		}
	});
};

export const kickOutPerson = ({ userID, liveID }: any): Promise<any> => {
	return requestT({
		method: "kickOutPerson",
		data: {
			type: 205,
			data: {
				kickedUID: userID,
				liveID
			}
		}
	});
};
