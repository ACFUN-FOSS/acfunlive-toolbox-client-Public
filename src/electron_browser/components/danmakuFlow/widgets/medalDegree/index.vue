<template>
	<div class="medal" v-show="getMedal(danmaku).clubName" :style="style">
		<div class="level" :style="degreeStyle" v-show="setting?.config?.degree">{{level}}</div>
		<div class="name" :style="nameStyle" v-show="setting?.config?.name">{{getMedal(danmaku).clubName}}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getMedal } from "../../utils/getter";
import {
	padding,
	margin,
	border,
	outerBox,
	font,
	position,
	transform,
	degreeColor
} from "../../utils/styleGetter";
import defaultValue from "./default";
import form from "./form";
export default defineComponent({
	name: "medalDegree",
	cname: "牌子(等级颜色)",
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
		level(): any {
			if (this.configMode) {
				return this.setting?.config?.preview;
			}
			return getMedal(this.danmaku).level;
		},
		style(): any {
			// @ts-ignore
			const style = this.setting?.style;
			if (!style) {
				return {};
			}
			const color = degreeColor(this.setting?.config?.color, this.level);

			return {
				...padding(style),
				...margin(style),
				...border(style),
				...outerBox(style),
				...position(style),
				...transform(style),
				...this.getSpecificColor(style, color)
			};
		},
		degreeStyle(): any {
			// @ts-ignore
			const style = this.setting?.degreeStyle;
			if (!style) {
				return {};
			}
			const color = degreeColor(this.setting?.config?.color, this.level);

			return {
				...padding(style),
				...margin(style),
				...border(style),
				...outerBox(style),
				...font(style),
				...position(style),
				...transform(style),
				...this.getSpecificColor(style, color)
			};
		},
		nameStyle(): any {
			// @ts-ignore
			const style = this.setting?.nameStyle;
			if (!style) {
				return {};
			}
			const color = degreeColor(this.setting?.config?.color, this.level);

			return {
				...padding(style),
				...margin(style),
				...border(style),
				...outerBox(style),
				...font(style),
				...position(style),
				...transform(style),
				...this.getSpecificColor(style, color)
			};
		}
	},
	methods: {
		getMedal,
		getSpecificColor(style: any, color: string) {
			if (!color) {
				return {};
			}
			const result: any = {};
			if (!style.specificColor) {
				result.color = color;
			}
			if (!style.specificBackgroundColor) {
				result.backgroundColor = color;
			}
			if (!style.specificBorderColor) {
				result.borderColor = color;
			}
			return result;
		}
	}
});
</script>
<style scoped lang='scss'>
.medal {
	display: inline-flex;
	white-space: nowrap;
	overflow: hidden;
	position: relative;
	align-items: center;
	& > div {
		display: inline-block;
		position: relative;
	}
	// .level {
	// }
	// .name {
	// }
}
</style>
