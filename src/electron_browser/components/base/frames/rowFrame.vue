<template>
	<div class="rowFrame" :style="{width}">
		<div class="title" v-if="title">{{title}}</div>
		<div :class="[{content:contentDefaultClass,flex:flex},contentClass]">
			<slot />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	name: "rowFrame",
	props: {
		title: {
			type: String
		},
		contentClass: {
			type: String
		},
		contentDefaultClass: {
			type: Boolean,
			default: false
		},
		flex: {
			type: Boolean,
			default: false
		},
		width: {
			type: String,
			default: "50%"
		}
	}
});
</script>

<style scoped  lang='scss'>
@import "@front/styles/variables.scss";
.rowFrame {
	position: relative;
	flex-shrink: 0;
	flex-grow: 0;
	margin-bottom: 16px;
	.flex {
		display: flex;
		flex-wrap: wrap;
	}
	.title {
		position: relative;
		font-weight: 700;
		color: $--color-text-primary;
		height: 24px;
		user-select: none;
	}
	.content {
		position: relative;
		background-color: white;
		width: 100%;
		box-shadow: $--box-shadow-base;
	}
}
</style>
