import store from "@front/store";
import testRouters from "@front/test";
import appletLayout from "@front/layouts/applets/index.vue";
import { restart } from "@front/util_function/login";
const main = () => import("@front/layouts/main/index.vue");
export default [
	{
		name: "applets",
		path: "/applets",
		component: appletLayout,
		hidden: true
	},
	{
		path: "/login",
		name: "Login",
		component: () => import("@front/views/login/index.vue")
	},
	{
		path: "/",
		name: "home",
		component: main,
		meta: {
			label: "直播"
		},
		redirect: "/dashboard",
		children: [
			{
				path: "/dashboard",
				name: "dashboard",
				meta: {
					label: "首页",
					icon: "el-icon-monitor",
					action: "router"
				},
				component: () => import("@front/views/dashboard/index.vue")
			},
			{
				path: "/roomMgmt",
				name: "roomMgmt",
				meta: {
					label: "房间管理",
					icon: "el-icon-house",
					action: "router",
					disabled: () => {
						return store.state.streamStatus.step === "unstreamable";
					}
				},
				component: () => import("@front/views/roomMgmt/index.vue")
			},
			{
				path: "/appletsList",
				name: "appletsList",
				meta: {
					label: "小程序",
					icon: "el-icon-menu",
					action: "router"
				},
				component: () => import("@front/views/applets/index.vue")
			},
			{
				path: "/restart",
				name: "restart",
				meta: {
					label: "快速重启！",
					icon: "el-icon-refresh-right",
					action: restart
				}
			},
			{
				path: "/magiScr",
				name: "magiScr",
				meta: {
					label: "魔法画屏",
					icon: "el-icon-magic-stick",
					action: "router",
					disabled: () => {
						return true;
					}
				},
				redirect: "/"
			}
		]
	},
	{
		path: "/record",
		name: "record",
		component: main,
		meta: {
			label: "录像"
		},
		children: [
			{
				path: "/streamRecord",
				name: "streamRecord",
				meta: {
					label: "直播录制",
					icon: "el-icon-video-camera",
					action: "router",
					disabled: () => {
						return false;
					}
				},
				component: () => import("@front/views/records/index.vue")
			}
		]
	},
	{
		path: "/data",
		name: "data",
		component: main,
		meta: {
			label: "数据"
		},
		children: [
			{
				path: "/replay",
				name: "replay",
				meta: {
					label: "完播复盘",
					icon: "el-icon-pie-chart",
					action: () => {
						window.open(
							`https://www.sizzwoo.cc/u/${store.state.userProfile.userID}`,
							"_blank"
						);
					},
					disabled: () => {
						return false;
					}
				},
				redirect: "/"
			}
		]
	},
	{
		path: "/config",
		name: "config",
		component: main,
		meta: {
			label: "设置与选项"
		},
		children: [
			{
				path: "/config/general",
				name: "general",
				component: () => import("@front/views/general/index.vue"),
				meta: {
					label: "通用",
					icon: "el-icon-setting",
					action: "router"
					// disabled: () => {
					// 	return true;
					// }
				}
				// redirect: "/"
			},
			{
				path: "/config/superChat",
				name: "superChat",
				component: () => import("@front/views/superChat/index.vue"),
				meta: {
					label: "超级聊",
					icon: "el-icon-upload2",
					action: "router"
				}
			},
			{
				path: "/config/emotion",
				name: "emotion",
				component: () => import("@front/views/emotion/index.vue"),
				meta: {
					label: "表情包",
					icon: "el-icon-edit",
					action: "router"
				}
			},
			{
				path: "/config/roomNameList",
				name: "roomNameList",
				component: () => import("@front/views/roomNameList/index.vue"),
				meta: {
					label: "小本本",
					icon: "el-icon-tickets",
					action: "router",
					disabled: () => {
						return false;
					}
				}
			},
			{
				path: "/config/danmakuSetting",
				name: "danmakuSetting",
				component: () =>
					import("@front/views/danmakuSetting/index.vue"),
				meta: {
					label: "弹幕流",
					icon: "el-icon-chat-line-square",
					action: "router",
					disabled: () => {
						return false;
					}
				}
			},
			{
				path: "/config/robot",
				name: "robot",
				component: () => import("@front/views/robot/index.vue"),
				meta: {
					label: "鸡鸡人",
					icon: "el-icon-user",
					action: "router",
					disabled: () => {
						return false;
					}
				}
			}
		]
	},
	...testRouters
];
