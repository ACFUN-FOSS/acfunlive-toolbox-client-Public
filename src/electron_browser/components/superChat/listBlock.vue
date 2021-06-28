<template>
	<div :class="{selected:selectedID===scBlock.uid}" class="super-chat-list-block" :style="progress">
		<div>
			<div class="content" :style="contentStyle">
				<img :src="scBlock.avatar" />
				<div class="donate">
					<div :key="display.value" class="combo">{{display.value}}</div>{{display.unit}}
				</div>
			</div>

			<div class="background" v-if="backgroundStyle" :style="backgroundStyle" />
			<component class="background" v-else :is="backgroundComponent" />
			<div class="background" :style="backgroundImageStyle" />
			<div class="progress" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { superChatBlock } from "./utils/data";
import { displayType as dp } from "@front/views/superChat/config/data";
import { hundrenFormatter } from "@front/util_function/formatter";
import { font } from "@front/components/danmakuFlow/utils/styleGetter";
import backgroundThemes from "@front/components/superChat/backgrounds";
export default defineComponent({
	name: "superChatListBlock",
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
		selectedID: {
			default: 0
		}
	},
	watch: {
		currentTime(n) {
			if (n > this.scBlock.listEndTime) {
				this.$emit("end");
			}
		}
	},
	computed: {
		display(): any {
			const unitTool = dp()[this.displayType] || dp()[0];
			let unit = unitTool.label;
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
				unit,
				value,
				nextLevel
			};
		},
		progress(): any {
			return {
				"--left": `${-100 +
					((this.scBlock.listEndTime - this.currentTime) * 100) /
						this.scBlock.listDuration}%`
			};
		},
		contentStyle(): any {
			if (this.scBlock.theme) {
				return font(this.scBlock.theme.listStyle);
			}
			return {};
		},
		backgroundStyle(): any {
			console.log("aa", this.scBlock);
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
.super-chat-list-block {
	height: 30px !important;
	position: relative;
	flex-shrink: 0;
	margin-right: 8px;
	user-select: none;
	cursor: pointer;
	margin-bottom: 2.5px;
	margin-top: 2.5px;
	&.selected::after {
		content: " ";
		position: absolute;
		width: 80%;
		margin: 0px 10%;
		height: 2px;
		bottom: 0px;
		transform: translateY(calc(100% + 4px));
		background-color: $--color-primary;
	}
	& > div {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
		border-radius: 15px;

		.content {
			position: relative;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			img {
				box-sizing: border-box;
				height: 30px;
				width: 30px;
				border-radius: 50%;
				border: 2px solid rgba(255, 255, 255, 0.5);
			}
			.donate {
				padding-left: 4px;
				padding-right: 8px;
				color: white;
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
			}

			z-index: 3;
		}
		.progress {
			z-index: 2;
			position: absolute;
			top: 0px;
			height: 100%;
			width: calc(100%);
			right: -100%;
			transform: translateX(var(--left));
			transition: transform 0.25s linear;
			background-color: rgba(0, 0, 0, 0.5);
		}
		.background {
			position: absolute;
			left: 0px;
			top: 0px;
			right: 0px;
			bottom: 0px;
			z-index: 1;
			background-repeat: no-repeat;
		}
	}
}
</style>
