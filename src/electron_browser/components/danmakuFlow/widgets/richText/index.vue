<template>
	<span class="content" :style="style">{{getRichText(danmaku)}}</span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
	padding,
	margin,
	border,
	outerBox,
	font,
	position,
	transform
} from "../../utils/styleGetter";
import { getRichText } from "@front/components/danmakuFlow/utils/getter";
import defaultValue from "./default";
import form from "./form";
export default defineComponent({
	name: "richText",
	cname: "系统消息",
	widgetOptions: {
		avaliable: [1006],
		limit: -1
	},
	props: {
		danmaku: {
			required: true
		},
		setting: {
			default: defaultValue()
		},
		configMode: {
			default: false
		}
	},
	data() {
		return {
			settingValue: defaultValue,
			settingForm: form
		};
	},
	computed: {
		style(): any {
			// @ts-ignore
			const style = this.setting?.style;
			if (!style) {
				return {};
			}
			return {
				...padding(style),
				...margin(style),
				...border(style),
				...outerBox(style),
				...font(style),
				...position(style),
				...transform(style)
			};
		}
	},
	methods: { getRichText }
});
</script>
<style scoped lang='scss'>
.content {
	display: inline;
	position: relative;
	word-break: break-all;
	word-wrap: break-word;
}
</style>
