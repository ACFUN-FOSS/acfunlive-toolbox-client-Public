<template>
	<div class="background rainbow-bg">

	</div>
</template>

<script>
export default {
	name: "background",
	cname: "彩虹小马"
};
</script>

<style lang="scss" scoped>
.background {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	animation: rainbow-bg 2.5s linear;
	animation-iteration-count: infinite;
}

@keyframes rainbow-bg {
	100%,
	0% {
		background-color: rgb(255, 0, 0);
	}
	8% {
		background-color: rgb(255, 127, 0);
	}
	16% {
		background-color: rgb(255, 255, 0);
	}
	25% {
		background-color: rgb(127, 255, 0);
	}
	33% {
		background-color: rgb(0, 255, 0);
	}
	41% {
		background-color: rgb(0, 255, 127);
	}
	50% {
		background-color: rgb(0, 255, 255);
	}
	58% {
		background-color: rgb(0, 127, 255);
	}
	66% {
		background-color: rgb(0, 0, 255);
	}
	75% {
		background-color: rgb(127, 0, 255);
	}
	83% {
		background-color: rgb(255, 0, 255);
	}
	91% {
		background-color: rgb(255, 0, 127);
	}
}
</style>
