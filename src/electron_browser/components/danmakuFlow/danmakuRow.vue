<template>
	<div class="danmaku-row" :class="{config:configMode}" :style="style">
		<component v-for="widget in setting.widgets" :is="widgets[widget.labelEn].component" :config-mode="configMode" :key="widget.id" :danmaku="danmaku" :setting="widget.value" :count="danmaku.count" />
		<div v-if="danmaku.combineCount>1" class="combo" :key="danmaku.combineCount">x{{danmaku.combineCount}}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import widgets from "@front/components/danmakuFlow/widgets";
import { getUserInfo } from "@front/components/danmakuFlow/utils/getter";
import {
	padding,
	margin,
	border,
	outerBox,
	transform
} from "@front/components/danmakuFlow/utils/styleGetter";
export default defineComponent({
	name: "danmakuRow",
	props: {
		setting: {
			required: true
		},
		danmaku: {
			required: true
		},
		configMode: {
			default: false
		}
	},
	data() {
		return {
			widgets
		};
	},
	computed: {
		danmakuWidgets(): any {
			// @ts-ignore
			return this.setting.widgets.filter(
				(widget: any) => widget.labelEn !== "mainBlock"
			);
		},
		style(): any {
			try {
				// @ts-ignore
				const style = this.setting.widgets.find(
					(widget: any) => widget.labelEn === "mainBlock"
				)?.value.style;
				if (style) {
					return {
						...padding(style),
						...margin(style),
						...border(style),
						...outerBox(style),
						...transform(style)
					};
				}
				return {};
			} catch (error) {
				console.error(error);
				return {};
			}
		}
	},
	methods: { getUserInfo }
});
</script>
<style scoped lang='scss'>
.danmaku-row {
	&.config {
		min-width: 300px;
	}
	width: 100%;
	box-sizing: border-box;
	word-break: break-all;
	word-wrap: break-word;
	position: relative;
	.combo {
		display: inline-block;
		vertical-align: middle;
		color: white;
		background-color: rgb(67, 136, 214);
		padding: 2px 4px;
		border-radius: 8px;
		animation: scale 0.25s forwards;
		margin: 6px;
	}
	@keyframes scale {
		0% {
			transform: scale(1.5);
		}
		100% {
			transform: scale(1);
		}
	}

	// &.is-liver {
	// 	width: calc(100% - 16px) !important;
	// 	padding-left: 8px !important;
	// 	padding-right: 8px !important;
	// 	padding-top: 8px !important;
	// 	padding-bottom: 24px !important;
	// 	border-radius: 4px !important;
	// 	background-color: rgb(0, 170, 255) !important;
	// 	&::after {
	// 		content: "主播发言";
	// 		color: white;
	// 		position: absolute;
	// 		left: 12px;
	// 		bottom: 4px;
	// 		font-size: 12px !important;
	// 	}
	// }
}
</style>
