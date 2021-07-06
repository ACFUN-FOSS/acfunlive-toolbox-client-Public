import { listenDpi } from "./listeners";
import { dpiOptions } from "@front/datas/common";
import { log } from "@front/util_function/system";
import { common } from "@front/texts";
const dpiOption: any = dpiOptions();

export const dpiHandler = () => {
	const dpi = window.devicePixelRatio;
	for (const i of dpiOption.reverse()) {
		if (dpi >= i[0]) {
			document.body.style.zoom = i[1];
			return;
		}
	}
	document.body.style.zoom = "100%";
};
export const logger = () => {
	const ept = () => 1;
	if (process.env.NODE_ENV === "production") {
		// const newConsole: any = {};
		// Object.keys(console).forEach(key => {
		// 	newConsole[key] = ept;
		// });
		// Object.assign(console, newConsole);
		window.addEventListener("error", e => {
			log(String(e.error.stack) + `@${common().version}`);
		});
	}
};
export const globalMethods = [dpiHandler, logger];

export const registerMethod = () => {
	globalMethods.forEach((handler: any) => {
		handler();
	});
};
