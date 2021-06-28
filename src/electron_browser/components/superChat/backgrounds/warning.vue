<template>
	<div class="background">

	</div>
</template>

<script>
export default {
	name: "background",
	cname: "警告"
};
</script>

<style lang="scss" scoped>
.background {
	--stripe-size: 100px;
	--color1: rgb(249, 253, 13);
	--color2: #313131;
	--duration: 2s;
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background: black;
	background-repeat: repeat !important;
	animation: move 35s linear infinite;
	&::before {
		content: " ";
		position: absolute;
		top: 0;
		left: 0;
		width: calc(100% + var(--stripe-size));
		height: 100%;
		background: repeating-linear-gradient(
			45deg,
			var(--color2) 25%,
			var(--color2) 50%,
			var(--color1) 50%,
			var(--color1) 75%
		);
		background-size: var(--stripe-size) var(--stripe-size);
		animation: stripeTransform var(--duration) linear infinite;
	}

	&::after {
		content: " ";
		position: absolute;
		width: 100%;
		height: 100%;
		background: radial-gradient(
			ellipse at center,
			rgba(#1b2735, 0) 0%,
			#090a0f 100%
		);
	}
}
@keyframes stripeTransform {
	0% {
		transform: translateX(0);
	}

	100% {
		transform: translateX(calc(var(--stripe-size) * -1));
	}
}

@keyframes stripeBackgroundPosition {
	0% {
		background-position: 0 0;
	}

	100% {
		background-position: calc(var(--stripe-size) * -1) 0;
	}
}
</style>
