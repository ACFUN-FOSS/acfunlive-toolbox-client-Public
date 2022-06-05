import * as Vue from "vue";
// @ts-ignore
import { loadModule } from "./vue3-sfc-loader.esm.js";
export const loadComponent = url => {
	return loadModule(url, {
		moduleCache: {
			vue: Vue
		},
		getFile(url) {
			return fetch(url).then(res => res.text());
		},

		addStyle(textContent) {
			const style = Object.assign(document.createElement("style"), {
				textContent
			});
			const ref = document.head.getElementsByTagName("style")[0] || null;
			document.head.insertBefore(style, ref);
		}
	});
};
