<template>
	<div class="hero">
		<div class="title">{{common.title}}</div>
		<div class="subtitle">{{common.subTitle}}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { common } from "@front/texts";
export default defineComponent({
	name: "heroBase",
	computed: { common }
});
</script>

<style scoped lang='scss'>
@import "@front/styles/variables.scss";

@font-face {
	font-family: "包图小白体";
	src: url("/fonts/包图小白体.ttf") format("truetype");
}

.hero {
	font-family: Roboto;
	color: white;
	user-select: none;
	position: relative;
	font-weight: 700;
	.title {
		font-size: 90px;
		letter-spacing: 8px;
		padding: 0px $--font-size-logo;
		font-family: 包图小白体;
		line-height: 100px;
	}
	.subtitle {
		font-family: 包图小白体;
		text-align: right;
		font-size: 65px;
	}
}
</style>
