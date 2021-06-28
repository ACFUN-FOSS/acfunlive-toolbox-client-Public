<template>
	<div class="super-chat-list-panel" :class="{configMode}">
		<div class="super-chat-list-panel-content" :style="contentStyle">
			<div class="title"><img :class="{showNextLevel}" :src="scBlock.avatar" />
				<div>
					<div>{{scBlock.nickName}}</div>
					<div>送出： <span :key="display.value" class="combo">{{display.value}}</span>{{display.unit}}</div>
					<div class="next" :style="tipStyle" v-if="showNextLevel">(距离下级还差：{{configMode?`20${display.fixUnit}`:`${display.nextLevel}${display.fixUnit}`}})</div>
				</div>
			</div>
			<transition name="fade">
				<div class="content" :key="scBlock.conten">
					{{scBlock.content||defaultContent}}
				</div>
			</transition>
		</div>
		<div class="background" v-if="backgroundStyle" :style="backgroundStyle" />
		<component class="background" v-else :is="backgroundComponent" />
		<div class="background" :style="backgroundImageStyle" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { superChatBlock } from "./utils/data";
import { font } from "@front/components/danmakuFlow/utils/styleGetter";
import { displayType as dp } from "@front/views/superChat/config/data";
import { mapState } from "vuex";
import { hundrenFormatter } from "@front/util_function/formatter";
import backgroundThemes from "@front/components/superChat/backgrounds";
export default defineComponent({
	name: "super-chat-list-panel",
	props: {
		scBlock: {
			default: () => {
				return superChatBlock();
			}
		},
		currentTime: {
			default: 0
		},
		displayType: {
			default: 0
		},
		configMode: {
			default: false
		}
	},
	watch: {
		currentTime(n) {
			if (n > this.scBlock.panelEndTime) {
				this.$emit("next");
			}
		}
	},
	computed: {
		...mapState(["danmakuProfile"]),
		display(): any {
			const unitTool = dp()[this.displayType] || dp()[0];
			const fixUnit = unitTool.label;
			let unit = fixUnit;

			let value: any = 0;
			let nextLevel: any = 0;
			if (this.scBlock.nextLevel > 0) {
				nextLevel = hundrenFormatter(
					unitTool.converter(this.scBlock.nextLevel)
				);
			}
			if (this.scBlock.value) {
				value = hundrenFormatter(
					unitTool.converter(this.scBlock.value)
				);
			} else {
				unit = "蕉";
				value = this.scBlock.number;
			}
			return {
				fixUnit,
				unit,
				value,
				nextLevel
			};
		},
		showNextLevel(): boolean {
			return (
				this.display.nextLevel &&
				Boolean(this.danmakuProfile.common?.superChat?.showNextLevel)
			);
		},
		defaultContent(): string {
			return this.scBlock?.theme?.config?.text || "我永远单推主播~~";
		},
		contentStyle(): any {
			if (this.scBlock.theme) {
				return font(this.scBlock.theme.panelStyle);
			}
			return {};
		},
		tipStyle(): any {
			const fontSize = this.scBlock?.theme?.panelStyle?.fontSize;
			if (fontSize) {
				return {
					fontSize: `${0.7 * fontSize}px`
				};
			}
			return { fontSize: "12px" };
		},
		backgroundStyle(): any {
			const {
				backgroundColor,
				backgroundType
			} = this.scBlock.theme.background;
			if (backgroundType === 1) {
				return false;
			}
			return {
				backgroundColor
			};
		},
		backgroundImageStyle(): any {
			const background = this.scBlock.theme.background;
			const {
				backgroundImage,
				backgroundSize,
				backgroundPosition,
				backgroundSizeType,
				backgroundOpacity
			} = background;
			return {
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize:
					backgroundSizeType !== 0
						? backgroundSizeType
						: `${backgroundSize}%`,
				backgroundPosition,
				opacity: backgroundOpacity / 100
			};
		},
		backgroundComponent(): any {
			const background = this.scBlock.theme.background;
			return (
				backgroundThemes[background.backgroundDynamic].component ||
				backgroundThemes.default
			);
		}
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/variables.scss";
.super-chat-list-panel {
	position: absolute;
	box-sizing: border-box !important;
	bottom: 0px;
	transform: translateY(calc(100% + 4px));
	overflow: hidden;
	border-radius: 4px;
	width: calc(100% - 16px);
	margin: 0px 8px;

	user-select: none;
	box-shadow: $--box-shadow-dark;
	z-index: 100;
	&.configMode {
		position: relative;
		transform: none;
		width: 300px;
	}
	* {
		box-sizing: border-box;
	}
	.super-chat-list-panel-content {
		position: relative;
		z-index: 2;
		color: white;
		.title {
			background-color: rgba(0, 0, 0, 0.5);
			display: flex;
			padding: 4px 16px;
			align-items: center;
			img {
				height: 2.5em;
				width: 2.5em;
				border-radius: 50%;
				border: solid 2px rgba(255, 255, 255, 0.5);
				&.showNextLevel {
					height: 3.5em;
					width: 3.5em;
				}
			}
			& > div {
				word-break: break-all;
				margin-left: 8px;
			}
			.next {
				opacity: 0.5;
			}
		}
		.content {
			padding: 8px 16px;
		}
	}
	.background {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100%;
		top: 0px;
		left: 0px;
		background-repeat: no-repeat;
	}
}
.combo {
	animation: scale 0.5s forwards;
	display: inline-block;
	margin-right: 2px;
}
@keyframes scale {
	0% {
		transform: scale(1.5);
	}
	100% {
		transform: scale(1);
	}
}
</style>
