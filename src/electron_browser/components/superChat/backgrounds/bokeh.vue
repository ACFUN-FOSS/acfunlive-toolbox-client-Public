<template>
	<div class="background">
		<span></span>
		<span></span>
		<span></span>
		<span></span>
		<span></span>
		<span></span>
		<span></span>
		<span></span>
		<span></span>
		<span></span>
		<span></span>
		<span></span>
		<span></span>
		<span></span>
		<span></span>
		<span></span>
		<span></span>
		<span></span>
		<span></span>
		<span></span>
	</div>
</template>

<script>
export default {
	name: "background",
	cname: "粉色萤火虫"
};
</script>

<style lang="scss" scoped>
.background {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background: #3e1e68;
	background-repeat: repeat !important;
}

$particleSize: 10px;
$animationDuration: 6s;
$amount: 20;
.background span {
	width: $particleSize;
	height: $particleSize;
	border-radius: $particleSize;
	backface-visibility: hidden;
	position: absolute;
	animation-name: move;
	animation-duration: $animationDuration;
	animation-timing-function: linear;
	animation-iteration-count: infinite;
	$colors: (#583c87, #e45a84, #ffacac);
	@for $i from 1 through $amount {
		&:nth-child(#{$i}) {
			color: nth($colors, random(length($colors)));
			top: random(100) * 1%;
			left: random(100) * 1%;
			animation-duration: (random($animationDuration * 10) / 10) *
				1s +
				10s;
			animation-delay: random(($animationDuration + 10s) * 10) / 10 * -1s;
			transform-origin: (random(50) - 25) * 1vw (random(50) - 25) * 1vh;
			$blurRadius: (random() + 0.5) * $particleSize * 0.5;
			$x: if(random() > 0.5, -1, 1);
			box-shadow: ($particleSize * 2 * $x) 0 $blurRadius currentColor;
		}
	}
}

@keyframes move {
	100% {
		transform: translate3d(0, 0, 1px) rotate(360deg);
	}
}
</style>
