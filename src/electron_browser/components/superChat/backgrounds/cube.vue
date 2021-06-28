<template>
	<div class="background">
		<div class="cube"></div>
		<div class="cube"></div>
		<div class="cube"></div>
		<div class="cube"></div>
		<div class="cube"></div>
	</div>
</template>

<script>
export default {
	name: "background",
	cname: "方块"
};
</script>

<style lang="scss" scoped>
.background {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background: linear-gradient(132deg, #fc415a, #591bc5, #212335);
	background-size: 400% 400%;
	animation: Gradient 15s ease infinite;
}
.cube {
	position: absolute;
	top: 80%;
	left: 45%;
	width: 10px;
	height: 10px;
	border: solid 1px #d7d4e4;
	transform-origin: top left;
	transform: scale(0) rotate(0deg) translate(-50%, -50%);
	animation: cube 12s ease-in forwards infinite;
}
.cube:nth-child(2n) {
	border-color: #fff;
}
.cube:nth-child(2) {
	animation-delay: 2s;
	left: 25%;
	top: 40%;
}
.cube:nth-child(3) {
	animation-delay: 4s;
	left: 75%;
	top: 50%;
}
.cube:nth-child(4) {
	animation-delay: 6s;
	left: 90%;
	top: 10%;
}
.cube:nth-child(5) {
	animation-delay: 8s;
	left: 10%;
	top: 85%;
}
.cube:nth-child(6) {
	animation-delay: 10s;
	left: 50%;
	top: 10%;
}
@keyframes Gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
@keyframes cube {
	from {
		transform: scale(0) rotate(0deg) translate(-50%, -50%);
		opacity: 1;
	}
	to {
		transform: scale(20) rotate(960deg) translate(-50%, -50%);
		opacity: 0;
	}
}
</style>
