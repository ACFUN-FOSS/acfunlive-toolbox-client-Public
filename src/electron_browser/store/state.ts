import generalStyle from "@fe/assets/json/style.json";
import generalConfig from "@fe/assets/json/config.json";
import { WsApi } from "@fe/api/ws";
import { user, room, stream, danmaku } from "@fe/api/ws_h";
export interface RootState {
	generalStyle: any; // 自定义样式
	generalConfig: any; // 自定义配置 如标题文字等
	api: any; // 接口
	serverOnline: boolean; // 后端是否启动
	userSession: user.session; // 用户登陆信息
	userProfile: user.profile; // 用户资料
	roomProfile: room.profileDetail; // 房间信息
	roomStatus: room.status; // 房间实时状态
	roomCategorys: Array<room.category>; // 全部房间分类
	isLogined: boolean; // 是否登陆
	streamStatus: stream.status;
	streamEncodec: stream.encodec; // 转码信息
	streamSession: stream.session; // 推流配置
	danmakuSession: danmaku.session; // 弹幕实时信息
	danmakuProfile: danmaku.profile; // 弹幕设置
}

export function stateFunc(): RootState {
	return {
		generalStyle,
		generalConfig,
		api: new WsApi(),
		serverOnline: false,
		isLogined: false,
		userSession: user.getSession(),
		userProfile: user.getProfile(),
		roomProfile: room.getProfileDetail(),
		roomStatus: room.getStatus(),
		roomCategorys: [],
		streamStatus: stream.getStatus(),
		streamEncodec: stream.getEncodec(),
		streamSession: stream.getSession(),
		danmakuSession: danmaku.getSession(),
		danmakuProfile: danmaku.getProfile()
	};
}

export const state: RootState = stateFunc();
