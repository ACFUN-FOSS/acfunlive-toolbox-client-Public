import { ElMessageBox } from "element-plus";
export const logout = (): void => {
	// backendRestart();
	sessionStorage.setItem("logined", "false");
	localStorage.setItem("tokenInfo", "");
	// router.push("/login");
	window.location.replace(`${window.location.origin}/login`);
};

export const restart = () => {
	ElMessageBox({
		title: "确认重启？",
		showCancelButton: true,
		confirmButtonText: "确定",
		cancelButtonText: "取消"
	}).then(restartConfirmed);
};
export const restartConfirmed = () => {
	sessionStorage.clear();
	// router.push("/login");
	window.location.replace(`${window.location.origin}/login`);
};
