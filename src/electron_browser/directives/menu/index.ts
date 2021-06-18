import { Directive, createApp } from "vue";
import menu from "./rightClickMenu.vue";

const directive = (): Directive => {
	let list: any = [];
	return {
		mounted(el, binding) {
			el.addEventListener("contextmenu", (e: any) => {
				const element = document.createElement("div");
				// list = binding.value;
				document.body.append(element);
				createApp(menu, {
					list,
					element,
					position: {
						x: e.clientX,
						y: e.clientY
					}
				}).mount(element);
				e.preventDefault();
			});
		},
		updated(el, binding) {
			list = binding.value;
		}
	};
};
export default directive;
