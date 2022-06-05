<template>
	<div class="timestamp" :style="style">{{time}}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { format, fromUnixTime } from "date-fns";
import { getTime } from "../../utils/getter";
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
	name: "timestamp",
	cname: "时间戳",
	widgetOptions: {
		avaliable: [1000, 1001, 1002, 1003, 1005, 1007, 1008],
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
				...padding(style),
				...margin(style),
				...border(style),
				...outerBox(style),
				...font(style),
				...position(style),
				...transform(style)
			};
		},
		config(): any {
			// @ts-ignore
			const config = this.setting?.config || defaultValue().config;
			return config;
		},
		time(): any {
			const time = format(
				fromUnixTime(getTime(this.danmaku) / 1000),
				this.config?.format || "HH:mm:ss"
			);
			const preffix = this.setting?.config?.preffix || "";
			const affix = this.setting?.config?.affix || "";
			return `${preffix}${time}${affix}`;
		}
	}
});
</script>
<style scoped lang='scss'>
.timestamp {
	display: inline-block;
	position: relative;
	color: white;
}
</style>
