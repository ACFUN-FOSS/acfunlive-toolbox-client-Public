import { listenDpi } from "./listeners";
import { dpiOptions } from "@front/datas/common";
import { log } from "@front/util_function/system";
import { common } from "@front/texts";
import { stringify } from "flatted";
const dpiOption: any = dpiOptions();

export const dpiHandler = () => {
	const dpi = window.devicePixelRatio;
	for (const i of dpiOption.reverse()) {
		if (dpi >= i[0]) {
			// TODO: Use CSSStyleDeclaration.
			(document.body.style as any).zoom = i[1];
			return;
		}
	}
	(document.body.style as any).zoom = "100%";
};
export const logger = () => {
	const ept = () => 1;
	if (process.env.NODE_ENV === "production") {
		// const newConsole: any = {};
		// Object.keys(console).forEach(key => {
		// 	newConsole[key] = ept;
		// });
		// Object.assign(console, newConsole);
		const er = console.error;
		const lg = console.log;
		console.error = (e: any) => {
			er(e);
			if (e instanceof Error) {
				log(String(e.stack) + `@${common().version}`);
			} else {
				log(stringify(e));
			}
		};
		console.log = (...e: any) => {
			lg(...e);
			log(stringify(e));
		};
		window.addEventListener("unhandledrejection", (e) => {
			if (e.reason instanceof Error) {
				log(String(e.reason.stack) + `@${common().version}`);
			}
		});
		window.addEventListener("error", (e) => {
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
