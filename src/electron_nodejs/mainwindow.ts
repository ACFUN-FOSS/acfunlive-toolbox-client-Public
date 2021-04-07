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

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import backend from "./backend";
const isDevelopment = process.env.NODE_ENV !== "production";
const { spawn } = require("child_process");
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
	{ scheme: "app", privileges: { secure: true, standard: true } }
]);

async function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 1048,
		height: 724,
		frame: false,
		show: false,
		resizable: true,
		transparent: true,
		hasShadow: false,
		webPreferences: {
			// Use pluginOptions.nodeIntegration, leave this alone
			// See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
			nodeIntegration: true,
			webSecurity: false,
			allowRunningInsecureContent: true,
			enableBlinkFeatures: "CSSVariables",
			enableRemoteModule: true
		}
	});

	win.once("ready-to-show", () => {
		win.show();
		// win.webContents.openDevTools();
	});

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		await win.loadURL(<string>process.env.WEBPACK_DEV_SERVER_URL);
		if (!process.env.IS_TEST) win.webContents.openDevTools();
	} else {
		createProtocol("app");
		// Load the index.html when not in development
		win.loadURL("app://./index.html");
	}
}

export default function init_mainwindow() {
	backend.init();
	ipcMain.on("backend_init", () => {
		backend.init();
	});
	ipcMain.on("backend_kill", () => {
		backend.kill();
	});
	ipcMain.on("backend_restart", () => {
		backend.restart();
	});
	// Quit when all windows are closed.
	app.on("window-all-closed", () => {
		// On macOS it is common for applications and their menu bar
		// to stay active until the user quits explicitly with Cmd + Q
		if (process.platform !== "darwin") {
			app.quit();
		}
	});

	app.on("activate", () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});

	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
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
		createWindow();
	});

	// Exit cleanly on request from parent process in development mode.
	if (isDevelopment) {
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
