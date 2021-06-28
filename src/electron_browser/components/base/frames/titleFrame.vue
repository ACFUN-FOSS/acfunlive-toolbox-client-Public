<template>
	<div class="contentTitle">
		<transition appear name="fade" mode="out-in">
			<span :key="title">{{title}}</span>
		</transition>
	</div>
	<div class="contentInner">
		<slot />
	</div>
</template>

<script>
export default {
	name: "titleFrame",
	props: ["title"]
};
</script>

<style scoped lang='scss'>
@import "@front/styles/variables.scss";
.contentTitle {
	position: relative;
	width: fit-content;
	margin: 17px 50px 22px 50px;
	padding-bottom: 8px;
	font-size: $--font-size-medium;
	line-height: calc(#{$--font-size-medium} + 10px);
	color: $--color-primary !important;
	border-bottom: 2px solid $--color-primary;
	user-select: none;
	z-index: 1;
}
.contentInner {
	position: relative;
	width: calc(100% - 100px);
	height: calc(100% - 75px);
	margin: 0px 50px;
}
</style>
