<template>
	<div class="background">
		<div class="bg"></div>
		<div class="bg bg2"></div>
		<div class="bg bg3"></div>
	</div>
</template>

<script>
export default {
	name: "background",
	cname: "现代"
};
</script>

<style lang="scss" scoped>
.background {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	overflow: hidden !important;
}
.bg {
	animation: slide 3s ease-in-out infinite alternate;
	background-image: linear-gradient(-60deg, #6c3 50%, #09f 50%);
	bottom: 0;
	left: -50%;
	opacity: 0.5;
	position: absolute;
	right: -50%;
	top: 0;
	z-index: -1;
}

.bg2 {
	animation-direction: alternate-reverse;
	animation-duration: 4s;
}

.bg3 {
	animation-duration: 5s;
}
@keyframes slide {
	0% {
		transform: translateX(-25%);
	}
	100% {
		transform: translateX(25%);
	}
}
</style>
