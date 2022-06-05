// import { obsApplets } from "@front/applets";
export default [
	{
		path: "/obs/danmaku",
		name: "danmaku",
		meta: {
			label: "弹幕流",
			icon: "el-icon-chat-line-square",
			action: "router",
			noElectron: true
		},
		component: () => import("@/electron_browser/views/danmakuWeb/index.vue")
	},
	{
		path: "/obs/danmakuSelf",
		name: "danmakuSelf",
		meta: {
			label: "弹幕流",
			icon: "el-icon-chat-line-square",
			action: "router",
			noElectron: true
		},
		component: () => import("@/electron_browser/views/danmakuWeb/self.vue")
	},
	{
		path: "/obs/applets",
		name: "obsApplet",
		meta: {
			label: "小程序",
			icon: "el-icon-chat-line-square",
			action: "router",
			noElectron: true
		},
		component: () =>
			import("@/electron_browser/views/danmakuWeb/obsApplet.vue")
	},
	{
		path: "/404",
		name: "404",
		component: () => import("@front/views/error-page/404.vue")
	}
];
