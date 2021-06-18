import { randomId } from "@front/util_function/base";
import { markRaw } from "vue";
const requireComponent = require.context(
	"@front/components/danmakuFlow/widgets",
	true,
	/\w+\.(vue)$/
);

const output: any = {};

requireComponent.keys().forEach(fileName => {
	const matches = fileName.match(/(?<=\/).+(?=\/index\.vue)/);
	if (matches) {
		const component = requireComponent(fileName).default;
		output[component.name] = {
			id: randomId(6),
			label: component.cname,
			labelEn: matches[0],
			widgetOptions: component.widgetOptions,
			component: markRaw(component),
			styleForm: component.data()?.settingForm(),
			styleValue: component.data()?.settingValue()
		};
	}
});
export default output;
