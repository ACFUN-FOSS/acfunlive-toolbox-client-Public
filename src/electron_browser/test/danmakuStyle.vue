<template>
	<div class="danmaku-row" style="background-color:black">
		<div class="s3container">
			<div class="box">
				<div class="left">
					<img class="img-avatar" src="" />
					<img
						class="img"
						src="/configFiles/selfDanmaku/images/mid.png"
					/>
				</div>
				<div class="right">
					<div class="top">
						测试测试测试测试
					</div>
					<div class="down">
						<marquee
							direction="right"
							scrollamount="3"
							v-html="'213123123123311231323213123'"
						></marquee>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	cname: "弹幕样式设计",
	name: "danmakuStyle",
	methods: {}
});
</script>
<style scoped lang="scss">
@font-face {
	font-family: "oswald";
	src: url("/configFiles/selfDanmaku/fonts/字体3（弹幕字体）.TTF");
}

.s3container {
	position: absolute;
	width: 500px;
	max-height: 600px;
	left: 50%;
	top: 30%;
	margin-left: -250px;
	margin-bottom: 20px;
}
.s3container .left {
	position: relative;
	margin-top: -8px;
}
.s3container .img-avatar {
	background-color: blue;
}
.s3container .left .img {
	width: 88px;
	position: absolute;
}
.s3container .left .img1 {
	width: 78px;
	height: 78px;
	border-radius: 50%;
	position: absolute;
	top: 13px;
	left: 3px;
}
.s3container .right {
	background-image: url("/configFiles/selfDanmaku/images/bg.png");
	background-size: 100% auto;
	width: 380px;
	height: 95px;
	padding-left: 15px;
}
.s3container .top {
	padding-top: 8px;
}
.s3container .top a {
	font-family: "oswald";
	display: block;
	color: #504221;
	font-size: 14px;
	font-weight: bold;
}
.s3container .down marquee {
	font-family: "oswald";
	color: #fff;
	font-size: 28px;
	text-align: center;
	padding: 17px 15px 0px 0px;
	text-shadow: -2px 0 #f981a4, 0 3px #f981a4, 3px 0 #f981a4, 0 -2px #f981a4;
	letter-spacing: 2px;
	width: 82%;
	margin-left: 25px;
}

.danmaku-row {
	width: 100%;
	box-sizing: border-box;
	word-break: break-all;
	word-wrap: break-word;
	position: relative;
	background-color: black !important;
	.combo {
		display: inline-block;
		vertical-align: middle;
		color: white;
		background-color: rgb(67, 136, 214);
		padding: 2px 4px;
		border-radius: 8px;
		animation: scale 0.25s forwards;
		margin: 6px;
	}
}
</style>
