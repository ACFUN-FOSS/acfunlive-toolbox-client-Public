<template>
	<div class="background">

	</div>
</template>

<script>
export default {
	name: "background",
	cname: "网格"
};
</script>

<style lang="scss" scoped>
$bg-url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAABnSURBVHja7M5RDYAwDEXRDgmvEocnlrQS2SwUFST9uEfBGWs9c97nbGtDcquqiKhOImLs/UpuzVzWEi1atGjRokWLFi1atGjRokWLFi1atGjRokWLFi1af7Ukz8xWp8z8AAAA//8DAJ4LoEAAlL1nAAAAAElFTkSuQmCC";
$bg-width: 50px;
$bg-height: 50px;

/* Animations */
@-webkit-keyframes bg-scrolling-reverse {
	100% {
		background-position: $bg-width $bg-height;
	}
}
@-moz-keyframes bg-scrolling-reverse {
	100% {
		background-position: $bg-width $bg-height;
	}
}
@-o-keyframes bg-scrolling-reverse {
	100% {
		background-position: $bg-width $bg-height;
	}
}
@keyframes bg-scrolling-reverse {
	100% {
		background-position: $bg-width $bg-height;
	}
}

@-webkit-keyframes bg-scrolling {
	0% {
		background-position: $bg-width $bg-height;
	}
}
@-moz-keyframes bg-scrolling {
	0% {
		background-position: $bg-width $bg-height;
	}
}
@-o-keyframes bg-scrolling {
	0% {
		background-position: $bg-width $bg-height;
	}
}
@keyframes bg-scrolling {
	0% {
		background-position: $bg-width $bg-height;
	}
}
.background {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	color: #999;
	overflow: hidden;
	font: 400 16px/1.5 exo, ubuntu, "segoe ui", helvetica, arial, sans-serif;
	text-align: center;
	/* img size is 50x50 */
	background: url($bg-url) repeat 0 0;
	background-repeat: repeat !important;
	-webkit-animation: bg-scrolling-reverse 0.92s infinite; /* Safari 4+ */
	-moz-animation: bg-scrolling-reverse 0.92s infinite; /* Fx 5+ */
	-o-animation: bg-scrolling-reverse 0.92s infinite; /* Opera 12+ */
	animation: bg-scrolling-reverse 0.92s infinite; /* IE 10+ */
	-webkit-animation-timing-function: linear;
	-moz-animation-timing-function: linear;
	-o-animation-timing-function: linear;
	animation-timing-function: linear;
}
</style>
