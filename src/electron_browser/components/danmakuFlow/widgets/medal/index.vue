<template>
	<div class="medal" v-show="getMedal(danmaku).clubName" :style="style">
		<div class="level" :style="degreeStyle" v-show="setting.config.degree">{{getMedal(danmaku).level}}</div>
		<div class="name" :style="nameStyle" v-show="setting.config.name">{{getMedal(danmaku).clubName}}</div>
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
	transform
} from "../../utils/styleGetter";
import defaultValue from "./default";
import form from "./form";
export default defineComponent({
	name: "medal",
	cname: "牌子",
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
				...padding(style),
				...margin(style),
				...border(style),
				...outerBox(style),
				...position(style),
				...transform(style)
			};
		},
		degreeStyle(): any {
			// @ts-ignore
			const style = this.setting?.degreeStyle;
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
		nameStyle(): any {
			// @ts-ignore
			const style = this.setting?.nameStyle;
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
	methods: {
		getMedal(danmaku: any) {
			return getMedal(danmaku);
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
