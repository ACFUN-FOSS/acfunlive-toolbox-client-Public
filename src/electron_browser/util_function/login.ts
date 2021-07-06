import store from "@front/store";
import router from "@front/router";
import { backendRestart } from "@front/util_function/system";
export const logout = (): void => {
	// backendRestart();
	sessionStorage.setItem("logined", "false");
	router.replace({
		path: "/login"
	});
	store.commit("reset");
	// @ts-ignore
	if (window.wsl) {
		// @ts-ignore
		window.wsl.close();
	}
};
