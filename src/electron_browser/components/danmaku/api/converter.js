// linghe data structure && orzogc data structure
import SM from "@fe/api/selfMethods";
export const LH_TEXT = () => {
	return {
		id: SM.randomId, // 随机id
		type: 0, // 弹幕姬中类型
		avatarUrl: "", // 头像链接
		time: null, // 发送时间
		authorName: "", // 用户名
		authorType: 0, // 用户类型 liver/房管/普通
		content: "", // 发言内容
		userMark: "", // 未知
		medal: { // 牌子
			ClubName: "",
			Level: 0,
			UperID: 0,
			UserID: 0
		},
		privilegeType: undefined, // 未知
		repeated: 1,
		translation: undefined
	};
};

export class ORZ_TO_LH {
	static getAvatarUrl(data) {
		return data.danmuInfo.userInfo.avatar;
	}

	static getTime(data) {
		return new Date(data.danmuInfo.sendTime);
	}

	static getAuthorName(data) {
		return data.danmuInfo.userInfo.nickname;
	}

	static getMedal(data) {
		return {
			ClubName: data.danmuInfo.userInfo.medal.clubName,
			Level: data.danmuInfo.userInfo.medal.level,
			UperID: data.danmuInfo.userInfo.medal.uperID
		};
	}

	static getContent(data) {
		return data.content;
	}

	static textConverter(data) {
		return {
			...LH_TEXT(),
			avatarUrl: this.getAvatarUrl(data),
			time: this.getTime(data),
			authorName: this.getAuthorName(data),
			medal: this.getMedal(data),
			content: this.getContent(data)
		};
	}
}

// export const lh_to_Orz_Text = (data) => {
// 	let text = lh_Text();
// 	return {
// 		...text,
// 		...{
// 			avatarUrl: ,
// 			time: ,
// 			authorName: ,
// 			content: "进入直播间",
// 			medal: {
// 				ClubName: data.userInfo.medal.
// 			}
// 		}
// 	}

// }

export class Typelist {
	static orzTypes = {
		TEXT: 1000,
		LOVE: 1001,
		JOIN: 1002,
		FOLLOW: 1003,
		GIFT: 1005,
		RICH_TEXT: 1006,
		JOIN_GROUP: 1007
	};

	static lhTypes = {
		TEXT: 2,
		LOVE: 8,
		JOIN: 1,
		FOLLOW: 10,
		GIFT: 3,
		RICH_TEXT: -1,
		JOIN_GROUP: 11
	};

	static selfTypes = {
		TEXT: 0,
		LOVE: 6,
		JOIN: 7,
		FOLLOW: 8,
		GIFT: 1,
		RICH_TEXT: -1,
		JOIN_GROUP: 10
	};

	static converter(from, to, type) {
		if (!this[from] || !this[to]) {
			return -1;
		}
		return this[to][
			Object.keys(this[from]).find(key => {
				return this[from][key] === type;
			})
		];
	}
}
