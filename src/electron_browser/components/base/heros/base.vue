<template>
	<div class="hero">
		<div class="title">{{generalConfig.title}}</div>
		<div class="subtitle">{{generalConfig.subTitle}}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { config } from "@fe/mixins/mixin";
export default defineComponent({
	name: "heroBase",
	mixins: [config]
});
</script>

<style scoped lang='scss'>
.hero {
	font-family: Roboto;
	color: white;
	user-select: none;
	position: relative;
	.title {
		font-size: var(--generalStyle_fontSize_LOGO);
		letter-spacing: 8px;
		padding: 0px var(--generalStyle_fontSize_LOGO);
	}
	.subtitle {
		font-family: "微软雅黑";
		text-align: right;
	}
}
</style>
