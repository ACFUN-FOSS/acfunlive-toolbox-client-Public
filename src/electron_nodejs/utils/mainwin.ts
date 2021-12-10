import { ipcMain, BrowserWindow, screen } from "electron";
import process from "process";
let wins: any = [];
let registered = false;
class MainWin {
	static registerEvents(mainWindow: BrowserWindow) {
		const win = {
			id: mainWindow.webContents.id,
			win: mainWindow,
			timer: null
		};
		wins.push(win);
		if (!registered) {
			const methods = [
				["mainwin_reload", MainWin.reload],
				["mainwin_setTop", MainWin.setTop],
				["mainwin_setResizeable", MainWin.setResizeable],
				["mainwin_setIgnoreMouseEvent", MainWin.setIgnoreMouseEvent]
			];
			methods.forEach((method: Array<any>) => {
				ipcMain.on(method[0], method[1]);
			});
			registered = true;
		}
		MainWin.startMouseDetector(win);
		mainWindow.on("close", () => {
			const timer: any = win.timer;
			clearTimeout(timer);
			wins = wins.filter((wn: any) => wn.id !== win.id);
		});
	}

	static selectWindow(event: any) {
		return wins.find((win: any) => win.id === event.sender.id);
	}

	static reload(event: any) {
		const win = MainWin.selectWindow(event).win;
		if (!win) return;
		win.reload();
	}

	static setTop(event: any, data: any) {
		const win = MainWin.selectWindow(event).win;
		if (!win) return;
		const { isTop } = JSON.parse(data);
		win.setAlwaysOnTop(isTop, "screen-saver", 1);
		win.setVisibleOnAllWorkspaces(isTop);
		win.setFullScreenable(!isTop);
	}

	static setResizeable(event: any, data: any) {
		const win = MainWin.selectWindow(event).win;
		if (!win) return;
		const { isResizeable }: any = JSON.parse(data);
		win.setResizable(isResizeable);
		if (isResizeable && process.platform === "linux") {
			win.setMinimumSize(300, 200);
			win.setMaximumSize(0, 0);
		}
	}

	static setFocusable(event: any, data: any) {
		const win = MainWin.selectWindow(event).win;
		if (!win) return;
		const { isFocusable }: any = JSON.parse(data);
		win.setFocusable(isFocusable);
	}

	static setIgnoreMouseEvent(event: any, data: any) {
		const win = MainWin.selectWindow(event).win;
		if (!win) return;
		const { ignore }: any = JSON.parse(data);
		win.setIgnoreMouseEvents(ignore, {
			forward: true
		});
		if (!ignore) {
			win.focus();
		}
	}

	static startMouseDetector(wi: any) {
		const { timer, win, id }: any = wi;
		clearTimeout(timer);
		try {
			const { x, y } = screen.getCursorScreenPoint();
			const winPos = win.getContentBounds();
			if (
				x > winPos.x &&
				y > winPos.y &&
				x - winPos.width < winPos.x &&
				y - winPos.height < winPos.y
			) {
				win.webContents.send("hover", true);
			} else {
				win.webContents.send("hover", false);
			}
		} catch (error) {}
		wi.timer = setTimeout(() => {
			MainWin.startMouseDetector(wi);
		}, 1000);
	}

	static newWindow(options: any = {}) {
		return new BrowserWindow({
			width: 1048,
			height: 724,
			minWidth: 300,
			minHeight: 200,
			frame: false,
			show: false,
			resizable: false,
			transparent: true,
			hasShadow: false,
			webPreferences: {
				// offscreen: true,
				nodeIntegration: true,
				contextIsolation: false,
				webSecurity: false,
				allowRunningInsecureContent: true,
				enableBlinkFeatures: "CSSVariables",
				enableRemoteModule: true,
				webviewTag: true
			},
			...options
		});
	}

	static closeAll() {
		wins.forEach((win: any) => {
			try {
				win.win.close();
			} catch (error) {}
		});
	}
}
export default MainWin;
