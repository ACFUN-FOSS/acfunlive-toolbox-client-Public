const path = require("path");
const fs = require("fs");

const isWin32 = process.platform === "win32";
export const isDev = process.env.NODE_ENV !== "production";

export const homedir = require("os").homedir();

export const getUserHome = () => {
	return process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"];
};

export const dirname = process.resourcesPath;

export const appStatic = path.join(dirname, "/app");
const configDir = process.platform === "win32" ? "/acfun-live-toolbox" : ".acfunlive-toolbox";
let configStat1c = path.join(getUserHome(), configDir);
if (process.env.NODE_ENV !== "production") {
	// @ts-ignore
	configStat1c = path.join(__static, "configFiles");
}
try {
	fs.accessSync(configStat1c);
} catch (error) {
	fs.mkdirSync(configStat1c, { recursive: true });
}
export const configStatic = configStat1c;
