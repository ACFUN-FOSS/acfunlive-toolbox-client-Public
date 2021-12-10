<template>
	<div class="avatar" :style="style" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAvatar } from "../../utils/getter";
import {
	size,
	padding,
	margin,
	border,
	outerBox,
	position,
	transform
} from "../../utils/styleGetter";
import defaultValue from "./default";
import form from "./form";
export default defineComponent({
	name: "avatar",
	cname: "用户头像",
	widgetOptions: {
		avaliable: [1000, 1001, 1002, 1003, 1005, 1008],
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
		style(): any {
			// @ts-ignore
			const style = this.setting?.style;
			if (!style) {
				return {};
			}
			return {
				...size(style),
				...padding(style),
				...margin(style),
				...border(style),
				...outerBox(style),
				...position(style),
				...transform(style),
				background: `url(${getAvatar(this.danmaku)})!important`
			};
		}
	}
});
</script>
<style scoped lang='scss'>
.avatar {
	display: inline-block;
	position: relative;
	background-position: center;
	background-size: 100%;
	background-repeat: no-repeat;
}
</style>
