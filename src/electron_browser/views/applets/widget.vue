<template>
	<div class="appletList">
		<div class="block" @click="startApplet(applet)" v-for="(applet,index) in applets" :key="index"
			:title="applet.name">
			<div :class="applet.icon" />
		</div>
	</div>
</template>

<script lang="ts" src="./mixin.ts" />

<style scoped lang='scss'>
@import "@front/styles/variables.scss";
@import "@front/styles/scrollbar.scss";

.appletList {
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
	@include scrollbarDark();
}
.block {
	height: 40px;
	width: 40px;
	border-radius: 4px;
	margin: 5px;
	display: flex;
	font-size: $--font-size-large;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	border: $--border-base;
	box-shadow: $--box-shadow-base;
	color: $--color-text-secondary;
	&:hover {
		color: $--color-primary;
		box-shadow: $--box-shadow-light;
	}
}
</style>
