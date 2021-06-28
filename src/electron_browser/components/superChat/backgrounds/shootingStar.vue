<template>
	<div class="background">
		<div class="night">
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
			<div class="shooting_star"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: "background",
	cname: "流星"
};
</script>

<style lang="scss" scoped>
$shooting-time: 3000ms;
.background {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
	background-repeat: repeat !important;
}

.night {
	position: relative;
	width: 100%;
	height: 100%;
	transform: rotateZ(45deg);
	// animation: sky 200000ms linear infinite;
}

.shooting_star {
	position: absolute;
	left: 50%;
	top: 50%;
	// width: 100px;
	height: 2px;
	background: linear-gradient(
		-45deg,
		rgba(95, 145, 255, 1),
		rgba(0, 0, 255, 0)
	);
	border-radius: 999px;
	filter: drop-shadow(0 0 6px rgba(105, 155, 255, 1));
	animation: tail $shooting-time ease-in-out infinite,
		shooting $shooting-time ease-in-out infinite;

	&::before {
		content: "";
		position: absolute;
		top: calc(50% - 1px);
		right: 0;
		// width: 30px;
		height: 2px;
		background: linear-gradient(
			-45deg,
			rgba(0, 0, 255, 0),
			rgba(95, 145, 255, 1),
			rgba(0, 0, 255, 0)
		);
		transform: translateX(50%) rotateZ(45deg);
		border-radius: 100%;
		animation: shining $shooting-time ease-in-out infinite;
	}

	&::after {
		// CodePen Error
		// @extend .shooting_star::before;

		content: "";
		position: absolute;
		top: calc(50% - 1px);
		right: 0;
		// width: 30px;
		height: 2px;
		background: linear-gradient(
			-45deg,
			rgba(0, 0, 255, 0),
			rgba(95, 145, 255, 1),
			rgba(0, 0, 255, 0)
		);
		transform: translateX(50%) rotateZ(45deg);
		border-radius: 100%;
		animation: shining $shooting-time ease-in-out infinite;
		transform: translateX(50%) rotateZ(-45deg);
	}

	@for $i from 1 through 20 {
		&:nth-child(#{$i}) {
			$delay: random(9999) + 0ms;
			top: calc(50% - #{random(400) - 200px});
			left: calc(50% - #{random(300) + 0px});
			animation-delay: $delay;
			// opacity: random(50) / 100 + 0.5;

			&::before,
			&::after {
				animation-delay: $delay;
			}
		}
	}
}

@keyframes tail {
	0% {
		width: 0;
	}

	30% {
		width: 100px;
	}

	100% {
		width: 0;
	}
}

@keyframes shining {
	0% {
		width: 0;
	}

	50% {
		width: 30px;
	}

	100% {
		width: 0;
	}
}

@keyframes shooting {
	0% {
		transform: translateX(0);
	}

	100% {
		transform: translateX(300px);
	}
}

@keyframes sky {
	0% {
		transform: rotate(45deg);
	}

	100% {
		transform: rotate(45 + 360deg);
	}
}
</style>
