<template>
	<div class="role" :style="display.style">{{display.text}} </div>
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
import { isManager, isOwner } from "../../utils/tester";
import defaultValue from "./default";
import form from "./form";
export default defineComponent({
	name: "role",
	cname: "身份",
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
		display(): any {
			let style: any = "";
			let text = "";
			if (this.configMode) {
				// @ts-ignore
				style = this.setting[this.setting.config.preview + "Style"];
				// @ts-ignore
				text = this.setting.config[
					this.setting.config.preview + "Title"
				];
			} else if (
				this.setting.config.owner &&
				isOwner(this.danmaku, this.$store.state)
			) {
				style = this.setting.ownerStyle;
				text = this.setting.config.ownerTitle;
			} else if (
				this.setting.config.manager &&
				isManager(this.danmaku, this.$store.state)
			) {
				style = this.setting.managerStyle;
				text = this.setting.config.managerTitle;
			}
			if (!style) {
				return {
					style: {
						display: "none"
					},
					text: ""
				};
			}
			return {
				style: {
					...font(style),
					...padding(style),
					...margin(style),
					...border(style),
					...outerBox(style),
					...position(style),
					...transform(style)
				},
				text
			};
		}
	}
});
</script>
<style scoped lang='scss'>
.role {
	display: inline-block;
	position: relative;
}
</style>
