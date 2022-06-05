import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { isElectron } from "@front/util_function/electron";
import client from "./clientRouter";
import web from "./webRouter";
const routes: Array<RouteRecordRaw> = isElectron() ? client : web;
console.log(routes);
const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});
if (!isElectron() || process.env.NODE_ENV === "production") {
	router.beforeEach((to, from, next) => {
		if (!isElectron()) {
			if (to.meta.noElectron || to.name === "404") {
				next();
				return;
			}
			next({
				name: "404"
			});
		} else {
			// @ts-ignore
			if (to.meta.disabled && to.meta.disabled()) {
				next(false);
				return;
			}
			if (to.fullPath.includes("applet")) {
				next();
				return;
			}

			if (sessionStorage.getItem("logined") === "true") {
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
		}
	});
}

export default router;
