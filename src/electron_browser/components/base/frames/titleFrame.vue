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
.contentTitle {
	position: relative;
	width: fit-content;
	margin: 25px 50px 22px 50px;
	font-size: var(--generalStyle_fontSize_M);
	line-height: calc(var(--generalStyle_fontSize_M) + 10px);
	color: var(--generalStyle_color_primary);
	border-bottom: 2px solid var(--generalStyle_color_primary);
	user-select: none;
}
.contentInner {
	position: relative;
	width: calc(100% - 100px);
	height: calc(100% - 75px);
	margin: 0px 50px;
}
</style>
