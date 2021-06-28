<template>
	<div class="background waveWrapper waveAnimation">
		<div class="waveWrapperInner bgTop">
			<div class="wave waveTop" style="background-image: url('http://front-end-noobs.com/jecko/img/wave-top.png')"></div>
		</div>
		<div class="waveWrapperInner bgMiddle">
			<div class="wave waveMiddle" style="background-image: url('http://front-end-noobs.com/jecko/img/wave-mid.png')"></div>
		</div>
		<div class="waveWrapperInner bgBottom">
			<div class="wave waveBottom" style="background-image: url('http://front-end-noobs.com/jecko/img/wave-bot.png')"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: "background",
	cname: "波浪"
};
</script>

<style lang="scss" scoped>
.background {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
}
@keyframes move_wave {
	0% {
		transform: translateX(0) translateZ(0) scaleY(1);
	}
	50% {
		transform: translateX(-25%) translateZ(0) scaleY(0.55);
	}
	100% {
		transform: translateX(-50%) translateZ(0) scaleY(1);
	}
}
.waveWrapper {
	overflow: hidden;
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	margin: auto;
}
.waveWrapperInner {
	position: absolute;
	width: 100%;
	overflow: hidden;
	height: 100%;
	bottom: -1px;
	background-image: linear-gradient(to top, #91d5fc 20%, #00a2ff 80%);
}
.bgTop {
	z-index: 15;
	opacity: 0.5;
}
.bgMiddle {
	z-index: 10;
	opacity: 0.75;
}
.bgBottom {
	z-index: 5;
}
.wave {
	position: absolute;
	left: 0;
	width: 200%;
	height: 100%;
	background-repeat: repeat no-repeat;
	background-position: 0 bottom;
	transform-origin: center bottom;
}
.waveTop {
	background-size: 50% 20%;
}
.waveAnimation .waveTop {
	animation: move-wave 3s;
	-webkit-animation: move-wave 3s;
	-webkit-animation-delay: 1s;
	animation-delay: 1s;
}
.waveMiddle {
	background-size: 50% 30%;
}
.waveAnimation .waveMiddle {
	animation: move_wave 5s linear infinite;
}
.waveBottom {
	background-size: 50% 20%;
}
.waveAnimation .waveBottom {
	animation: move_wave 7s linear infinite;
}
</style>
