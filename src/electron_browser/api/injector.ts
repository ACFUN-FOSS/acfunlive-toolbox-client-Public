import sm from "@fe/api/selfMethods";
import { event } from "@fe/api/eventBus";
import { App } from "vue";
// import renderComp from "../components/render";
const apis: any = {
	$SM: sm,
	$Event: event
	// $RC: renderComp
};

export function initSM(vm: App) {
	for (const key in apis) {
		vm.config.globalProperties[key] = apis[key];
	}
}
export function initGlobalComp(vm: App) {
	const requireComponent = require.context(
		"@fe/components/base/",
		true,
		/\w+\.(vue)$/
	);

	requireComponent.keys().forEach(fileName => {
		const componentConfig = requireComponent(fileName);
		vm.component(
			componentConfig.default.name ||
				fileName.replace("./", "").replace(".vue", ""),
			componentConfig.default || componentConfig
		);
	});
}
