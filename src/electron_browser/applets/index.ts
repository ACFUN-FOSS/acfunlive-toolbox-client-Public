import { defineAsyncComponent, markRaw } from "vue";
const requireComponent = require.context("@front/applets", true);

const clientApplets: any = [];
const obsApplets: any = [];
const blackList = ["./randomImage/", "./randomVideo/"];
const founded = requireComponent.keys();
founded.forEach(fileName => {
	if (
		fileName === "./" ||
		!fileName.match(/\/$/g) ||
		blackList.includes(fileName)
	) {
		return;
	}

	const clientAppPath = `${fileName}index.vue`;
	const obsAppPath = `${fileName}obs.vue`;
	const hasClient = founded.includes(clientAppPath);
	const hasObs = founded.includes(obsAppPath);
	if (!hasClient) return;
	const clientConfig = requireComponent(clientAppPath);
	clientApplets.push({
		cname: clientConfig.default.cname || clientConfig.default.name,
		name: clientConfig.default.name,
		icon: clientConfig.default.icon || "el-icon-ice-cream-round",
		description: clientConfig.default.description,
		component: markRaw(
			defineAsyncComponent(() =>
				import(`@front/applets/${clientAppPath.replace("./", "")}`)
			)
		),
		configurations: {
			...clientConfig.default.configurations,
			hasObs
		} || { hasObs }
	});

	if (!hasObs) return;
	const obsConfig = requireComponent(obsAppPath);
	obsApplets.push({
		cname: obsConfig.default.cname || obsConfig.default.name,
		name: obsConfig.default.name,
		icon: obsConfig.default.icon || "el-icon-ice-cream-round",
		description: obsConfig.default.description,
		component: markRaw(
			defineAsyncComponent(() =>
				import(`@front/applets/${obsAppPath.replace("./", "")}`)
			)
		),
		configurations: obsConfig.default.configurations || {}
	});
});

export { clientApplets, obsApplets };
