import { clientApplets } from "@front/applets";
import appletLayout from "@front/layouts/applets/index.vue";
export default {
	name: "applets",
	path: "/applets",
	component: appletLayout,
	children: clientApplets.map(({ name, component, cname }: any) => {
		return {
			name,
			component,
			meta: {
				cname
			},
			path: `/applets/${name}`
		};
	})
};
