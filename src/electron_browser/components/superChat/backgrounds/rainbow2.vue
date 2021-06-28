<template>
	<div class="background rainbow-bg">

	</div>
</template>

<script>
export default {
	name: "background",
	cname: "彩虹小马（2）"
};
</script>

<style lang="scss" scoped>
.background {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background-image: linear-gradient(
		to right,
		red,
		orange,
		yellow,
		green,
		blue,
		indigo,
		violet,
		red
	);
	background-repeat: repeat !important;
	animation: move 35s linear infinite;
}
@keyframes move {
	to {
		background-position: 600vh;
	}
}
</style>
