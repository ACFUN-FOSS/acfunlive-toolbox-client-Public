<template>
	<span class="content" :style="style" v-html="content" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { getContentWithEmoji as getContent } from "@front/components/danmakuFlow/utils/getter";
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
	name: "content",
	cname: "弹幕文字",
	widgetOptions: {
		avaliable: [1000],
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
		...mapState(["danmakuProfile", "temp"]),
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
		content(): any {
			const prefix = this.setting?.config?.preffix || "";
			const affix = this.setting?.config?.affix || "";
			const danmaku: any = this.danmaku;
			return `${prefix}${getContent(danmaku)}${affix}`;
		}
	},
	methods: {}
});
</script>
<style scoped lang="scss">
.content {
	display: inline;
	position: relative;
	word-break: break-all;
	word-wrap: break-word;
}
</style>
