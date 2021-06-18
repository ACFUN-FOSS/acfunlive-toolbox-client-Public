<template>
	<div class="nickName" :style="style">{{setting.config.preffix}}{{getNickName(danmaku)}}{{setting.config.affix}} </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getNickName } from "../../utils/getter";
import {
	padding,
	margin,
	border,
	outerBox,
	font,
	position,
	transform
} from "../../utils/styleGetter";
import defaultValue from "./default";
import form from "./form";
export default defineComponent({
	name: "nickName",
	cname: "用户名",
	widgetOptions: {
		avaliable: [1000, 1001, 1002, 1003, 1005, 1007],
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
				...font(style),
				...padding(style),
				...margin(style),
				...border(style),
				...outerBox(style),
				...position(style),
				...transform(style)
			};
		}
	},
	methods: {
		getNickName(danmaku: any) {
			return getNickName(danmaku);
		}
	}
});
</script>
<style scoped lang='scss'>
.nickName {
	display: inline-block;
	position: relative;
}
</style>
