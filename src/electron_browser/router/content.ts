import { defineAsyncComponent } from "vue";
import { RouteRecordRaw, RouteLocation } from "vue-router";
import main from "@fe/layouts/main/index.vue";
import store from "@fe/store";
const content: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "home",
		component: main,
		meta: {
			label: "直播"
		},
		redirect: "dashboard",
		children: [
			{
				path: "/dashboard",
				name: "dashboard",
				meta: {
					label: "首页",
					icon: "el-icon-monitor",
					action: "router"
				},
				component: defineAsyncComponent(() =>
					import("@fe/views/dashboard/index.vue")
				)
			},
			{
				path: "/roomMgmt",
				name: "roomMgmt",
				meta: {
					label: "房间管理",
					icon: "el-icon-house",
					action: "router",
					disabled: () => {
						return !store.state.streamStatus.avaliable;
					}
				},
				component: defineAsyncComponent(() =>
					import("@fe/views/roomMgmt/index.vue")
				)
			},
			{
				path: "callStatusPanel",
				name: "statusPanel",
				meta: {
					label: "监控面板",
					icon: "el-icon-data-analysis",
					action: "event",
					disabled: () => {
						return !store.getters.streamMonitor;
					}
				},
				redirect: "/"
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
						return true;
					}
				},
				redirect: "/"
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
		path: "/config",
		name: "config",
		component: main,
		meta: {
			label: "设置与选项"
		},
		children: [
			{
				path: "/general",
				name: "general",
				meta: {
					label: "通用",
					icon: "el-icon-setting",
					action: "router",
					disabled: () => {
						return true;
					}
				},
				redirect: "/"
			},
			{
				path: "/danmaku",
				name: "danmaku",
				meta: {
					label: "弹幕流",
					icon: "el-icon-chat-line-square",
					action: "router",
					disabled: () => {
						return true;
					}
				},
				redirect: "/"
			},
			{
				path: "/robot",
				name: "robot",
				meta: {
					label: "鸡鸡人",
					icon: "el-icon-user",
					action: "router",
					disabled: () => {
						return true;
					}
				},
				redirect: "/"
			}
		]
	}
];

export default content;
