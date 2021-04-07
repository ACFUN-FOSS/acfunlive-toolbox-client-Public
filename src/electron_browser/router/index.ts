/*
 * AcFunlive toolbox client, AcFun直播工具箱的客戶端
 * 版權所有 (C) 2020 ACFUN-FOC(ACFUN自由與開源9課)
 * 此程序爲自由軟件：本程序遵守自由軟件聯盟(FSF)所發佈之GNU Affero通用公共許可第三版。
 * 在此條約下、伱可以再發行・修改之。
 * 我等開發者希望本程序能是實用的軟件、竝心懷如此願望而發佈。但此程序
 * ！       ！       ！       ！
 * 無       有       擔       保  。
 * ！       ！       ！       ！
 * 無 有 任 何 擔 保 。甚至不保證它能有用・能對伱產生經濟效益。
 * 伱應該收到了一份GNU Affero通用公共許可第三版、它伴隨着本程序。若伱沒有收到，請查閱
 * <http://www.gnu.org/licenses/>。同時提供伱的電子郵寄地址或傳統的郵件聯繫方式。
 */

import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { defineAsyncComponent } from "vue";
import content from "./content";
import Cookies from "@fe/utils/cookies";
const routes: Array<RouteRecordRaw> = [
	...content,
	{
		path: "/obs/danmaku",
		name: "danmaku",
		meta: {
			label: "弹幕流",
			icon: "el-icon-chat-line-square",
			action: "router",
			noLogin: true
		},
		component: defineAsyncComponent(() =>
			import("@fe/components/danmakuSelf/single.vue")
		)
	},
	{
		path: "/login",
		name: "Login",
		component: defineAsyncComponent(() =>
			import("@fe/layouts/login/index.vue")
		)
	}
];

const router = createRouter({
	history: createWebHashHistory(process.env.BASE_URL),
	routes
});
router.beforeEach((to, from, next) => {
	if (to.meta.disabled && to.meta.disabled()) {
		next(false);
		return;
	}
	if (to.meta.noLogin) {
		next();
		return;
	}
	if (Cookies.get("logined") === "true") {
		if (to.name !== "Login") {
			next();
			return;
		}
		next({
			name: "dashboard"
		});
		return;
	}
	if (to.name === "Login") {
		next();
		return;
	}
	next({
		name: "Login"
	});
});
export default router;
