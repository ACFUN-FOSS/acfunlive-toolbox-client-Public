import { listenDpi } from "./listeners";
import { dpiOptions } from "@front/datas/common";

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

export const globalMethods = [dpiHandler];

export const registerMethod = () => {
	globalMethods.forEach((handler: any) => {
		handler();
	});
};
