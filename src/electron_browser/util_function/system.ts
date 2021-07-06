import { isElectron } from "@front/util_function/electron";
import { randomId, removePunctuationSpace } from "@front/util_function/base";
export const path = isElectron() ? window.require("path") : {};
const { remote, ipcRenderer }: any = isElectron()
	? window.require("electron")
	: {};
export { ipcRenderer };
export const win = remote?.getCurrentWindow();
export const minimize = () => {
	if (isElectron()) {
		win?.minimize();
	}
};

export const close = () => {
	if (isElectron()) {
		win?.close();
	}
};
export const log = (msg: any) => {
	if (isElectron()) {
		ipcRenderer?.send("log", String(msg));
	}
};

export const setTop = (isTop: boolean) => {
	if (isElectron()) {
		ipcRenderer?.send(
			"mainwin_setTop",
			JSON.stringify({
				isTop
			})
		);
	}
};

export const setIgnoreMouseEvent = (ignore: boolean) => {
	if (isElectron()) {
		ipcRenderer?.send(
			"mainwin_setIgnoreMouseEvent",
			JSON.stringify({
				ignore
			})
		);
	}
};

export const setResizeable = (isResizeable: boolean) => {
	if (isElectron()) {
		ipcRenderer?.send(
			"mainwin_setResizeable",
			JSON.stringify({
				isResizeable
			})
		);
	}
};

export const restore = () => {
	if (isElectron()) {
		win?.restore();
	}
};

export const backendKill = () => {
	if (isElectron()) {
		ipcRenderer?.send("backend_kill");
	}
};

export const backendRestart = () => {
	if (isElectron()) {
		ipcRenderer?.send("backend_restart");
	}
};

export const backendInit = () => {
	if (isElectron()) {
		ipcRenderer?.send("backend_init");
	}
};

export const launch = (path: any) => {
	if (isElectron()) {
		ipcRenderer?.send("backend_launch", path);
	}
};

export const save = (data: any) => {
	if (isElectron()) {
		ipcRenderer?.send("backend_save", JSON.stringify(data));
	}
};

export const reload = () => {
	if (isElectron()) {
		ipcRenderer?.send("mainwin_reload");
	}
};

export const load = (data: any) => {
	return new Promise((resolve, reject) => {
		try {
			if (!isElectron()) {
				throw new Error("no electron!");
			}
			ipcRenderer?.send("backend_load", JSON.stringify(data));
			ipcRenderer?.once("load_complete", (e: any, args: any) => {
				if (args !== "#error") {
					resolve(args);
				} else {
					throw new Error("load file failed!");
				}
			});
		} catch (error) {
			reject(error);
		}
	});
};

export const copy = ({ srcUrl, distUrl }: any) => {
	return new Promise((resolve, reject) => {
		try {
			if (!isElectron()) {
				throw new Error("no electron!");
			}
			ipcRenderer?.send(
				"backend_copy",
				JSON.stringify({
					srcUrl,
					distUrl
				})
			);
			ipcRenderer?.once("copy_file_complete", (e: any, args: any) => {
				if (args !== "#error") {
					resolve(args);
				} else {
					throw new Error("copy file failed!");
				}
			});
		} catch (error) {
			reject(error);
		}
	});
};

export const uploadImage = (imageUrl: string) => {
	return copy({
		srcUrl: imageUrl,
		distUrl: `./images/image${randomId(12)}${path.extname(imageUrl)}`
	});
};

export const uploadBase64Image = (b64: string) => {
	return new Promise((resolve, reject) => {
		try {
			if (!isElectron()) {
				throw new Error("no electron!");
			}
			ipcRenderer?.send("backend_save_b64", b64);
			ipcRenderer?.once("save_b64_complete", (e: any, args: any) => {
				if (args !== "#error") {
					resolve(args);
				} else {
					throw new Error("load file failed!");
				}
			});
		} catch (error) {
			reject(error);
		}
	});
};

export const saveConfig = (data: any) => {
	if (!isElectron()) {
		throw new Error("no electron!");
	}
	ipcRenderer?.send("backend_save_config", JSON.stringify(data));
};

export const loadConfig = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!isElectron()) {
				throw new Error("no electron!");
			}
			ipcRenderer?.send("backend_load_config");
			ipcRenderer?.once("load_config_complete", (e: any, args: any) => {
				if (args !== "#error") {
					resolve(JSON.parse(args));
				} else {
					throw new Error("load file failed!");
				}
			});
		} catch (error) {
			reject(error);
		}
	});
};

export const restoreConfig = (path: string) => {
	return new Promise((resolve, reject) => {
		try {
			if (!isElectron()) {
				throw new Error("no electron!");
			}
			ipcRenderer?.send("load_backup", path);
			ipcRenderer?.once("load_backup_complete", (e: any, args: any) => {
				if (args !== "#error") {
					resolve(JSON.parse(args));
				} else {
					throw new Error("读取备份文件失败！");
				}
			});
		} catch (error) {
			reject(error);
		}
	});
};
export const backupConfig = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!isElectron()) {
				throw new Error("no electron!");
			}
			ipcRenderer?.send("save_backup");
			ipcRenderer?.once("save_backup_complete", (e: any, args: any) => {
				if (args !== "#error") {
					resolve(args);
				} else {
					throw new Error("备份文件失败！");
				}
			});
		} catch (error) {
			reject(error);
		}
	});
};

export const saveSuperChat = (data: any) => {
	if (!isElectron()) {
		throw new Error("no electron!");
	}
	ipcRenderer?.send("backend_save_superchat", JSON.stringify(data));
};

export const loadSuperChat = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!isElectron()) {
				throw new Error("no electron!");
			}
			ipcRenderer?.send("backend_load_superchat");
			ipcRenderer?.once(
				"load_superchat_complete",
				(e: any, args: any) => {
					if (args !== "#error") {
						resolve(JSON.parse(args));
					} else {
						throw new Error("load file failed!");
					}
				}
			);
		} catch (error) {
			reject(error);
		}
	});
};

export const getFontList = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!isElectron()) {
				throw new Error("no electron!");
			}
			ipcRenderer?.send("backend_font_list");
			ipcRenderer?.once("font_list_complete", (e: any, args: any) => {
				if (args !== "#error") {
					resolve(JSON.parse(args));
				} else {
					throw new Error("load font failed!");
				}
			});
		} catch (error) {
			reject(error);
		}
	});
};

export const uploadFont = (fontUrl: string) => {
	return copy({
		srcUrl: fontUrl,
		distUrl: `./fonts/${path.basename(fontUrl)}`
	});
};

export const sendChat = (data: any) => {
	return new Promise((resolve, reject) => {
		try {
			if (!isElectron()) {
				throw new Error("no electron!");
			}
			ipcRenderer?.send("send_chat", JSON.stringify(data));
			ipcRenderer?.once("send_chat_complete", (e: any, args: any) => {
				if (args !== "#error") {
					resolve(args);
				} else {
					throw new Error("send chat failed!");
				}
			});
		} catch (error) {
			reject(error);
		}
	});
};

export const windowsRead = ({ speed, text, volume }: any) => {
	return new Promise((resolve, reject) => {
		try {
			if (!isElectron()) {
				throw new Error("no electron!");
			}
			ipcRenderer?.send(
				"send_voice",
				JSON.stringify({
					volume,
					speed,
					text: removePunctuationSpace(text)
				})
			);
			ipcRenderer?.once("voice_complete", (e: any, args: any) => {
				if (args !== "#error") {
					resolve(args);
				} else {
					throw new Error("send chat failed!");
				}
			});
		} catch (error) {
			reject(error);
		}
	});
};

export const xfRead = ({ api, voiceName, speed, text, volume }: any) => {
	return new Promise((resolve, reject) => {
		try {
			if (!isElectron()) {
				throw new Error("no electron!");
			}
			ipcRenderer?.send(
				"send_xfvoice",
				JSON.stringify({
					api,
					volume,
					speed,
					text: removePunctuationSpace(text)
				})
			);
			ipcRenderer?.once("xfvoice_complete", (e: any, args: any) => {
				if (args !== "#error") {
					const audio = new Audio(`${args}?cb=${Date.now()}`);
					audio.onerror = reject;
					audio.onended = resolve;
					audio.play();
				} else {
					reject(new Error("send chat failed!"));
				}
			});
		} catch (error) {
			reject(error);
		}
	});
};

export const robots = {
	default: windowsRead,
	kdxf: xfRead
};
