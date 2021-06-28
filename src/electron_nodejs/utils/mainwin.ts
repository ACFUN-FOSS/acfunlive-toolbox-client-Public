import { ipcMain, BrowserWindow, screen } from "electron";
let mouseMoveTimer: any = null;
class MainWin {
	static registerEvents(mainWindow: BrowserWindow) {
		ipcMain.on("mainwin_reload", () => {
			MainWin.reload(mainWindow);
		});
		ipcMain.on("mainwin_setTop", (event: any, data: any) => {
			MainWin.setTop(mainWindow, JSON.parse(data));
		});
		ipcMain.on("mainwin_setResizeable", (event: any, data: any) => {
			MainWin.setResizeable(mainWindow, JSON.parse(data));
		});
		ipcMain.on("mainwin_setIgnoreMouseEvent", (event: any, data: any) => {
			MainWin.setIgnoreMouseEvent(mainWindow, JSON.parse(data));
		});
		MainWin.startMouseDetector(mainWindow);
	}

	static reload(mainWindow: BrowserWindow) {
		mainWindow.reload();
	}

	static setTop(mainWindow: BrowserWindow, { isTop }: any) {
		mainWindow.setAlwaysOnTop(isTop, "screen-saver", 1);
		mainWindow.setVisibleOnAllWorkspaces(isTop);
		mainWindow.setFullScreenable(!isTop);
	}

	static setResizeable(mainWindow: BrowserWindow, { isResizeable }: any) {
		mainWindow.setResizable(isResizeable);
	}

	static setFocusable(mainWindow: BrowserWindow, { isFocusable }: any) {
		mainWindow.setFocusable(isFocusable);
	}

	static setIgnoreMouseEvent(mainWindow: BrowserWindow, { ignore }: any) {
		mainWindow.setIgnoreMouseEvents(ignore, {
			forward: true
		});
		if (!ignore) {
			mainWindow.focus();
		}
	}

	static startMouseDetector(mainWindow: BrowserWindow) {
		clearTimeout(mouseMoveTimer);
		try {
			const { x, y } = screen.getCursorScreenPoint();
			const winPos = mainWindow.getContentBounds();
			if (
				x > winPos.x &&
				y > winPos.y &&
				x - winPos.width < winPos.x &&
				y - winPos.height < winPos.y
			) {
				mainWindow.webContents.send("hover", true);
			} else {
				mainWindow.webContents.send("hover", false);
			}
		} catch (error) {}
		mouseMoveTimer = setTimeout(() => {
			MainWin.startMouseDetector(mainWindow);
		}, 100);
	}
}
export default MainWin;
