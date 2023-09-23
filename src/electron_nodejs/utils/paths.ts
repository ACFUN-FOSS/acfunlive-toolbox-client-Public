const path = require("path");
const fs = require("fs");

const isWin32 = process.platform === "win32";
export const isDev = process.env.NODE_ENV !== "production";

export const homedir = require("os").homedir();

export const getUserHome = () => {
	return process.env[isWin32 ? "USERPROFILE" : "HOME"];
};

export const dirname = process.resourcesPath;
// @ts-ignore
export const appStatic = isDev ? __static : path.join(dirname, "/app");
export const configStatic = isDev // @ts-ignore
	? path.join(__static, "configFiles")
	: path.join(
			getUserHome(),
			isWin32 ? "/acfun-live-toolbox" : ".acfunlive-toolbox"
	  );
fs.mkdirSync(configStatic, { recursive: true });
