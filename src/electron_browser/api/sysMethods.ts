import { App, BrowserWindow, Remote } from "electron";

export class SysMethods {
	ipcRenderer: any;
	remote: Remote;
	win: BrowserWindow;
	app: App;
	constructor() {
		const { remote, ipcRenderer } = window.require("electron");
		this.ipcRenderer = ipcRenderer;
		this.remote = remote;
		this.win = this.remote.getCurrentWindow();
		this.app = this.remote.app;
	}

	minimize() {
		this.win.minimize();
	}

	close() {
		this.win.close();
	}

	restore() {
		this.win.restore();
	}

	backendKill() {
		this.ipcRenderer.send("backend_kill");
	}

	backendRestart() {
		this.ipcRenderer.send("backend_restart");
	}

	backendInit() {
		this.ipcRenderer.send("backend_init");
	}
}

export const sy = new SysMethods();
