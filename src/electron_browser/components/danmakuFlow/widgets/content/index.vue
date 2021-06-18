<template>
	<span class="content" :style="style" v-html="setting.config.preffix+getContent(danmaku)+setting.config.affix" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { getContent } from "../../utils/getter";
import { replace } from "lodash";
import { isElectron } from "@front/util_function/electron";
import { escapeRegExp } from "@front/util_function/base";
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
		}
	},
	methods: {
		getContent(danmaku: any) {
			let content = getContent(danmaku);
			if (!this.danmakuProfile.common.emotion || this.configMode) {
				return content;
			}
			let { emojiTester, emojiMatcher } = this.temp;
			if (!emojiTester || !emojiMatcher) {
				const { matcher, tester } = this.generateTester();
				emojiTester = this.temp.emojiTester = tester;
				emojiMatcher = this.temp.emojiMatcher = matcher;
			}
			if (isElectron()) {
				[...content.matchAll(/ac\d+/g)].forEach(match => {
					content = replace(
						content,
						match[0],
						`<a target="_blank" href="https://www.acfun.cn/v/${match[0]}" style="color:rgb(100,238,238)">${match[0]}(点击查看)</a>`
					);
				});
			}
			const max = this.danmakuProfile.common.emotionMax || 3;
			[...content.matchAll(emojiTester)].forEach((match, index) => {
				if (!emojiMatcher[match[0]]) {
					return;
				}
				let replacement = "";
				if (index < max) {
					replacement = `<img style="max-width:${
						emojiMatcher[match[0]].scale
					}px;margin-left:8px;margin-top:8px;vertical-align:bottom" src="${
						emojiMatcher[match[0]].url
					}" />`;
				}
				content = content.replace(match[0], replacement);
			});
			return content;
		},
		generateTester() {
			const matcher = {};
			const testerArr: any = [];
			this.danmakuProfile.common.emojis.forEach((emoji: any) => {
				const regex = escapeRegExp(emoji.pattern);
				testerArr.push(regex);
				// @ts-ignore
				matcher[emoji.pattern] = {
					url: emoji.url,
					scale: emoji.scale,
					regex: new RegExp(regex, "g")
				};
			});
			const tester = (this.temp.emojiTester = new RegExp(
				testerArr.join("|"),
				"g"
			));
			this.temp.emojiMatcher = matcher;
			return {
				tester,
				matcher
			};
		}
	}
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
