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

"use strict";

import {
	app,
	protocol,
	BrowserWindow,
	shell,
	globalShortcut,
	contentTracing
} from "electron";
import installExtension from "electron-devtools-installer";
import {
	Backend,
	File,
	startHttp,
	MainWin,
	KsApi,
	Voice,
	AppTest,
	Applets
} from "./utils";
const isDevelopment = process.env.NODE_ENV !== "production";
app.commandLine.appendSwitch("disable-renderer-backgrounding");
app.commandLine.appendSwitch("disable-backgrounding-occluded-windows");
app.commandLine.appendSwitch("ignore-certificate-errors");
if (process.platform === "linux") {
	app.commandLine.appendSwitch("enable-transparent-visuals");
	app.commandLine.appendSwitch("disable-gpu");
}
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
	{ scheme: "app", privileges: { secure: true, standard: true } }
]);
async function createWindow() {
	// Create the browser window.
	const win = MainWin.newWindow();
	win.setMenu(null);
	const gotTheLock = app.requestSingleInstanceLock();
	if (!gotTheLock) {
		app.quit();
	} else {
		app.on("second-instance", (event, commandLine, workingDirectory) => {
			// Someone tried to run a second instance, we should focus our window.
			if (win) {
				if (win.isMinimized()) win.restore();
				win.focus();
			}
		});

		// Create myWindow, load the rest of the app, etc...
		app.on("ready", async () => {
			if (process.platform === "linux") {
				await sleep(500);
			}
		});
	}
	win.once("ready-to-show", () => {
		win.show();
		// win.webContents.openDevTools();
	});
	win.on("close", () => {
		MainWin.closeAll();
	});
	win.webContents.on("new-window", function(e, url) {
		e.preventDefault();
		shell.openExternal(url);
	});
	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		await win.loadURL(<string>process.env.WEBPACK_DEV_SERVER_URL);
		if (!process.env.IS_TEST) win.webContents.openDevTools();
	} else {
		// Load the index.html when not in development
		startHttp().then((res: any) => {
			win.loadURL(res);
		});
	}

	globalShortcut.register("CommandOrControl+F1", () => {
		win.webContents.send("switch-ignore-mode");
	});
	globalShortcut.register("CommandOrControl+F2", () => {
		win.webContents.send("switch-ignore-mode-temp");
	});
	Backend.registerEvents();
	File.registerEvents();
	MainWin.registerEvents(win);
	KsApi.registerEvents();
	Voice.registerEvents();
	AppTest.registerEvents(app);
	Backend.init();
	Applets.registerEvents();
}

export default function initMainWindow() {
	// Quit when all windows are closed.
	app.on("window-all-closed", () => {
		// On macOS it is common for applications and their menu bar
		// to stay active until the user quits explicitly with Cmd + Q
		app.quit();
	});

	app.on("ready", async () => {
		if (isDevelopment && !process.env.IS_TEST) {
			// Install Vue Devtools
			try {
				await installExtension(
					"ljjemllljcmogpfapbkkighbhhppjdbg",
					true
				);
			} catch (e) {
				console.error("Vue Devtools failed to install:", e.toString());
			}
		}

		if (process.platform === "linux") {
			await sleep(500);
		}

		createWindow();
	});

	// Exit cleanly on request from parent process in development mode.
	if (isDevelopment || true) {
		if (process.platform === "win32") {
			process.on("message", data => {
				if (data === "graceful-exit") {
					app.quit();
				}
			});
		} else {
			process.on("SIGTERM", () => {
				app.quit();
			});
		}
	}
}

function sleep(duration: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, duration));
}
