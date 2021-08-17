<template>
	<div class="appletList">
		<div class="block" @click="startApplet(applet)" v-for="(applet,index) in applets" :key="index" :title="applet.cname">
			<div :class="applet.icon" />
		</div>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { clientApplets as applets } from "@front/applets";
import { startApplet } from "@front/util_function/system";
export default defineComponent({
	name: "appletList",
	data() {
		return { applets };
	},
	// computed: {
	// 	applets() {
	// 		let i = 100;
	// 		let output = [];
	// 		while (i--) {
	// 			output = [...output, ...applets];
	// 		}
	// 		return output;
	// 	}
	// },
	methods: {
		startApplet
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/variables.scss";
@import "@front/styles/scrollbar.scss";

.appletList {
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
	@include scrollbarDark();
}
.block {
	height: 40px;
	width: 40px;
	border-radius: 4px;
	margin: 5px;
	display: flex;
	font-size: $--font-size-large;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	border: $--border-base;
	box-shadow: $--box-shadow-base;
	color: $--color-text-secondary;
	&:hover {
		color: $--color-primary;
		box-shadow: $--box-shadow-light;
	}
}
</style>
