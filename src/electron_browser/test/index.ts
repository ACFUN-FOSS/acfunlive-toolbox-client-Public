import component from "*.vue";
import main from "@front/layouts/main/index.vue";
let output: Array<any> = [];
if (process.env.NODE_ENV !== "production") {
	const children: Array<any> = [];
	const requireComponent = require.context("./", false, /\w+\.(vue)$/);
	requireComponent.keys().forEach(fileName => {
		const componentConfig = requireComponent(fileName);
		const name =
			componentConfig.default.cname || componentConfig.default.name;
		children.push({
			path: `/${componentConfig.default.name}`,
			name,
			component: componentConfig.default,
			meta: {
				label: name,
				action: "router"
			}
		});
	});
	output = [
		{
			path: "/testEnv",
			name: "testEnv",
			component: main,
			meta: {
				label: "测试组件"
			},
			children
		}
	];
}

export default output;
