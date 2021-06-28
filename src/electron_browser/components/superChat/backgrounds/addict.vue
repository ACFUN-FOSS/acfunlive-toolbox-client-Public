<template>
	<div class="background">
		<div class="a"></div>
		<div id="circle"></div>
	</div>
</template>

<script>
export default {
	name: "background",
	cname: "中毒"
};
</script>

<style lang="scss" scoped>
.background {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background: black;
}
#circle {
	width: 95vw;
	height: 95vh;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	margin: auto;

	position: absolute;
	background: radial-gradient(
		#0b853d 3px,
		transparent 5px,
		#000 7px,
		transparent 9px,
		#0b853d 11px,
		transparent 13px,
		15px,
		transparent 17px,
		#000 19px,
		transparent 21px,
		#0b853d 23px,
		transparent 25px,
		#fff 27px,
		transparent 29px,
		#000 31px,
		transparent 33px
	);

	background-size: 30px 30px;
}
.a {
	-webkit-animation: adjustHue 1s alternate infinite;
}

@-webkit-keyframes adjustHue {
	0% {
		-webkit-filter: hue-rotate(30deg);
	}
	50% {
		-webkit-filter: hue-rotate(60deg);
	}
	100% {
		-webkit-filter: hue-rotate(90deg);
	}
}
@-webkit-keyframes loading {
	to {
		-webkit-transform: rotate(360deg);
	}
}
@-moz-keyframes loading {
	to {
		-moz-transform: rotate(360deg);
	}
}
@-ms-keyframes loading {
	to {
		-ms-transform: rotate(360deg);
	}
}
@keyframes loading {
	to {
		transform: rotate(360deg);
	}
}
#circle {
	-webkit-animation-name: blinker;
	-webkit-animation-duration: 3s;
	-webkit-animation-timing-function: linear;
	-webkit-animation-iteration-count: infinite;
	-moz-animation-name: blinker;
	-moz-animation-duration: 3s;
	-moz-animation-timing-function: linear;
	-moz-animation-iteration-count: infinite;
	animation-name: blinker;
	animation-duration: 3s;
	animation-timing-function: linear;
	animation-iteration-count: infinite;
	color: red;
}

@-moz-keyframes blinker {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0.3;
	}
	100% {
		opacity: 1;
	}
}

@-webkit-keyframes blinker {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0.3;
	}
	100% {
		opacity: 1;
	}
}

@keyframes blinker {
	0% {
		opacity: 1;
	}
	50% {
		opacity: 0.3;
	}
	100% {
		opacity: 1;
	}
}
.a {
	background: radial-gradient(
		#0b853d 3px,
		transparent 5px,
		#000 7px,
		transparent 9px,
		#0b853d 11px,
		transparent 13px,
		15px,
		transparent 17px,
		#000 19px,
		transparent 21px,
		#0b853d 23px,
		transparent 25px,
		#fff 27px,
		transparent 29px,
		#000 31px,
		transparent 33px
	);
	background-color: #000;
	background-size: 32px 32px;
	overflow: hidden;
	width: 100vw;
	height: 100vh;
	margin: -10px;
}
body {
	overflow: hidden;
	background: #000;
	transform-style: preserve-3d;
}
</style>
