<template>
	<div class="normal-block" :style="style" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import {
	size,
	margin,
	padding,
	border,
	outerBox,
	position,
	transform,
	aspectRatio
} from "../../utils/styleGetter";
import defaultValue from "./default";
import form from "./form";
export default defineComponent({
	name: "sharePic",
	cname: "分享平台图标",
	widgetOptions: {
		avaliable: [1008],
		limit: -1
	},
	props: {
		danmaku: {
			required: true
		},
		setting: {
			default: defaultValue()
		}
	},
	data() {
		return {
			settingValue: defaultValue,
			settingForm: form
		};
	},
	computed: {
		...mapState(["danmakuProfile", "temp"]),
		url(): string {
			const danmaku: any = this.danmaku;
			return danmaku?.data.sharePlatformIcon || "";
		},
		style(): any {
			// @ts-ignore
			const style = this.setting?.style;
			if (!style) {
				return {};
			}
			return {
				...size(style),
				...margin(style),
				...padding(style),
				...border(style),
				...outerBox(style),
				...position(style),
				...transform(style),
				...aspectRatio(style),
				backgroundImage: `url(${this.url})`,
				backgroundSize: "100% 100%"
			};
		}
	},
	methods: {}
});
</script>
<style scoped lang='scss'>
.normal-block {
	display: inline-block;
	position: relative;
	background-size: 100% 100%;
}
</style>
