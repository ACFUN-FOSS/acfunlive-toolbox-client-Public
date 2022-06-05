<template>
	<div id="home">
		<component ref="comp" :is="component" v-bind="utils" />
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { loadComponent } from "@front/layouts/applets/httpVue";
import * as lodash from "lodash";
import {
	danmakuTesters,
	danmakuGetters
} from "@front/components/danmakuFlow/danmakuRow/advanceFunctions";
import { wsevent } from "@front/api/wsbus";
import { registerRole } from "@front/util_function/base";
export default defineComponent({
	name: "obsApplet",
	methods: {
		reset() {
			window.location.reload();
		}
	},
	data() {
		return {
			component: null
		};
	},
	mounted() {
		document.body.classList.add("applet");
		const { path, name } = this.$route.query;
		registerRole(`${name}-obs`);
		wsevent.register(`${name}-obs`);
		loadComponent(decodeURIComponent(path)).then(res => {
			const data = {};

			const methods = {
				lodash,
				danmakuTesters,
				danmakuGetters,
				wsevent
			};
			for (const key in methods) {
				data[`s_${key}`] = methods[key];
			}
			this.$nextTick(() => {
				this.component = defineComponent({
					mixins: [res],
					data() {
						return data;
					}
				});
			});
		});
	}
});
</script>

<style scoped lang="scss">
@import "@front/styles/variables.scss";

#home {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	width: 100%;
	height: 100%;
	font-size: $--font-size-base;
	box-shadow: $--box-shadow-dark;
	position: absolute;
	background-color: transparent;
	left: 0px;
	top: 0px;
	border-radius: $--border-radius-small;
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex-direction: row;
}
</style>
