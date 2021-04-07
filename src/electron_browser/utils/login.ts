import store from "@fe/store";
import router from "@fe/router";
import Cookies from "@fe/utils/cookies";
export const logout = (): void => {
	store.commit("reset");
	Cookies.set("logined", "false");
	router.push("login");
};
