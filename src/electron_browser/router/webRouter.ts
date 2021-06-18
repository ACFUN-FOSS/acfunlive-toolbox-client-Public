// import testRouters from "@front/test";
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
	// ...testRouters,
	{
		path: "/404",
		name: "404",
		component: () => import("@front/views/error-page/404.vue")
	}
];
