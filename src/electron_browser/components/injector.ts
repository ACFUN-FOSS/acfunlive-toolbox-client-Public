import { App } from "vue";
export const initGlobalComp = (vm: App) => {
	const requireComponent = require.context(
		"@front/components/base/",
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
};
