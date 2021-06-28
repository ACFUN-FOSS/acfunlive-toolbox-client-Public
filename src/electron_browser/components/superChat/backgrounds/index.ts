import { defineAsyncComponent, markRaw } from "vue";
import { basename } from "@front/util_function/base";
const requireComponent = require.context(
	"@front/components/superChat/backgrounds",
	true,
	/\w+\.(vue)$/
);

const output: any = {};
const backgroundArray: any = [];
requireComponent.keys().forEach(fileName => {
	const component = requireComponent(fileName).default;
	const value = basename(fileName).replace(".vue", "");
	backgroundArray.push({
		label: component.cname,
		value
	});
	output[value] = {
		label: component.cname,
		value,
		component: markRaw(
			defineAsyncComponent(() =>
				import(`@front/components/superChat/backgrounds/${value}.vue`)
			)
		)
	};
});
export default output;
export { backgroundArray };
