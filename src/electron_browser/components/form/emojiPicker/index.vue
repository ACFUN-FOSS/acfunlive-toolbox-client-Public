<template>
	<el-popover placement="bottom" trigger="click">
		<el-tabs class="emoji-tabs" type="border-card">
			<el-tab-pane v-for="emojiList in emojiClassification" :label="emojiList.label" :key="emojiList.label">
				<div class="iContent">
					<div class="iconBlock" :class="{active:modelValue==emoji}" v-for="(emoji,index) in emojiList.emojis" :key="index" @click="$emit('update:modelValue',emoji)">
						<span v-html="emoji"></span>
					</div>
				</div>
			</el-tab-pane>
		</el-tabs>
		<template #reference>
			<div style="display:inline-block">
				<div class="currentIcon" v-if="showSelected">{{modelValue||"无"}}</div>
				<slot v-else />
			</div>
		</template>

	</el-popover>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as emojiCollection from "./emoji";
export default defineComponent({
	name: "emojiPicker",
	props: ["modelValue", "showSelected"],
	data() {
		const emojiClassification: any = [];
		return {
			emojiClassification
		};
	},
	beforeMount() {
		for (const key in emojiCollection) {
			// @ts-ignore
			this.emojiClassification = [
				...this.emojiClassification,
				{
					// @ts-ignore
					label: key, // @ts-ignore
					emojis: emojiCollection[key].split(" ")
				}
			];
		}
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/variables.scss";
@import "@front/styles/scrollbar.scss";
.emoji-tabs {
	margin: -12px;
	width: 470px;
}
.iContent {
	width: 440px;
	height: 300px;
	display: flex;
	flex-wrap: wrap;
	overflow-y: auto;
	@include scrollbarDark();
	.iconBlock {
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		font-size: $--font-size-extra-large;
		display: flex;
		align-items: center;
		justify-content: center;
		border: $--border-base;
		margin: -1px 0 0 -1px;
		cursor: pointer;
		background-color: white;
		transform: all 0.25s;
		&:hover,
		&.active {
			background-color: $--color-primary-light-4;
			box-shadow: $--box-shadow-base;
			z-index: 1000;
			transform: scaleX(1.1) scaleY(1.1);
		}
		&:nth-child(10n + 1) {
			margin: -1px 0 0 0px;
		}
		&:nth-child(10n + 1) {
			margin: -1px 0 0 0px;
		}
		&:nth-child(-n + 10) {
			margin-top: 0;
		}
	}
}
.currentIcon {
	box-sizing: border-box;
	display: inline-flex;
	vertical-align: middle;
	font-size: $--font-size-large;
	cursor: pointer;
	border: $--border-base;
	height: 28px;
	padding: 0px 4px;
	align-items: center;
	border-radius: $--border-radius-base;
}
</style>
