<template>
	<div class="normal-block" :style="style">{{platformName}}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import {
	size,
	padding,
	margin,
	border,
	outerBox,
	font,
	position,
	transform,
	aspectRatio
} from "../../utils/styleGetter";
import defaultValue from "./default";
import form from "./form";
export default defineComponent({
	name: "shareText",
	cname: "分享平台文字",
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
		platformName(): string {
			const danmaku: any = this.danmaku;
			const platformType: number = danmaku?.data?.sharePlatform;
			return (
				[
					null,
					"QQ",
					"QQ空间",
					"新浪微博",
					"微信",
					"微信朋友圈",
					"A站动态"
				][platformType] || "未知空间"
			);
		},
		style(): any {
			// @ts-ignore
			const style = this.setting?.style;
			if (!style) {
				return {};
			}
			return {
				...size(style),
				...font(style),
				...padding(style),
				...margin(style),
				...border(style),
				...outerBox(style),
				...position(style),
				...transform(style),
				...aspectRatio(style)
			};
		}
	}
});
</script>
<style scoped lang='scss'>
.normal-block {
	display: inline-block;
	position: relative;
	background-size: 100% 100%;
}
</style>
