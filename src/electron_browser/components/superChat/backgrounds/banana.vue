<template>
	<div class="background">

	</div>
</template>

<script>
export default {
	name: "background",
	cname: "香蕉堆"
};
</script>

<style lang="scss" scoped>
.background {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background-image: url(https://static.yximgs.com/bs2/giftCenter/giftCenter-20200316101317UbXssBoH.webp?imageView2/1/w/80/h/80);
	background-size: 40px;
	background-repeat: repeat !important;
	animation: shift 1s linear infinite;
	background-color: rgb(255, 238, 0);
}
@keyframes shift {
	0% {
		background-position: 0px 0px;
	}
	100% {
		background-position: 40px 40px;
	}
}
</style>
