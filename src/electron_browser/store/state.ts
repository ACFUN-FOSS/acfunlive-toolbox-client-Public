import { user, room, stream, danmaku, temp } from "@front/datas";
import { isElectron } from "@front/util_function/electron";
import { Filter } from "@front/components/danmakuFlow/utils/common";
export interface RootState {
	serverOnline: boolean; // 后端是否启动
	userSession: user.Session; // 用户登陆信息
	userProfile: user.Profile; // 用户资料
	userData: user.Data; // 用户名密码
	roomProfile: room.ProfileDetail; // 房间信息
	roomStatus: room.Status; // 房间实时状态
	roomCategorys: Array<room.Category>; // 全部房间分类
	managerList: Array<any>; // 房管列表
	rank: room.Rank; // 排行榜信息
	isLogined: boolean; // 是否登陆
	isReconnect: boolean;
	isElectron: boolean; // 是否浏览器环境
	streamStatus: stream.Status;
	streamEncodec: stream.Encodec; // 转码信息
	streamSession: stream.Session; // 推流配置
	danmakuSession: danmaku.Session; // 弹幕实时信息
	danmakuProfile: danmaku.Profile; // 弹幕设置
	filter: Filter; // 过滤器
	minify: boolean; // 是否迷你化
	temp: temp.TempInfo;
	changedDanmaku: Array<any>; //新增弹幕列表
}

export function stateFunc(): RootState {
	return {
		serverOnline: false,
		isLogined: false,
		minify: false,
		isReconnect: false,
		isElectron: isElectron(),
		userSession: user.session(),
		userProfile: user.profile(),
		userData: user.data(),
		roomProfile: room.profileDetail(),
		roomStatus: room.status(),
		roomCategorys: [],
		managerList: [],
		rank: room.rank(),
		streamStatus: stream.status(),
		streamEncodec: stream.encodec(),
		streamSession: stream.session(),
		danmakuSession: danmaku.session(),
		danmakuProfile: danmaku.profile(),
		filter: new Filter(),
		temp: temp.tempInfo(),
		changedDanmaku: []
	};
}

export const state: RootState = stateFunc();
