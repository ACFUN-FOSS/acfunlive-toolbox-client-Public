<template>
	<div class="background rainbow-bg">
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
		<div class='c'></div>
	</div>
</template>

<script>
export default {
	name: "background",
	cname: "彩虹雨"
};
</script>

<style lang="scss" scoped>
$total: 144;
$time: 4;
$height: 400;
$percent: 0.69444%;
$dotSize: 0.9;
.background {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background: black;
	background-repeat: repeat !important;
	animation: move 35s linear infinite;
}

.c {
	position: relative;
	height: $height + px;
	width: $percent;
	margin-top: -$height + px;
	animation: drop $time + s infinite ease-in;
	// &:after {
	// 	content: "";
	// 	position: absolute;
	// 	width: $dotSize + vw;
	// 	height: $dotSize + vw;
	// 	border-radius: 50%;
	// 	left: 50%;
	// 	bottom: -($dotSize/2) + vw;
	// 	margin-left: -($dotSize/2) + vw;
	// }
}

@for $i from 1 through $total {
	$hue: (300 / $total) * $i;
	.c:nth-child(#{$i}) {
		left: ($i - 1) * $percent;
		background-image: linear-gradient(
			to bottom,
			black,
			hsla($hue, 100%, 50%, 0.8)
		);
		animation-delay: random($total) * ($time/$total) * -1s;
		&:after {
			background: hsla($hue, 100%, 50%, 1);
		}
	}
}

@keyframes drop {
	80% {
		opacity: 1;
	}
	100% {
		transform: translate3d(0, 150vh, 0);
		opacity: 0;
	}
}
</style>
