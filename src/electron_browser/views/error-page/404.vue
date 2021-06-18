<template>
	<div class="error-page">
		<div class="img404">
			<div class="img-icon"></div>
			<div class="page-text"><span>咦？世界线变动了，你好像来到了奇怪的地方。看看其他内容吧~</span>
				<br>
				<el-button type="primary" style="margin-top:15px" @click="$router.back">返回</el-button>
			</div>

		</div>
	</div>
</template>

<style scoped lang='scss'>
.error-page {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	.img404 {
		width: 718px;
		height: 218px;
		display: flex;
		padding-bottom: 200px;
		& > div {
			flex-shrink: 0;
		}
	}
	.img-icon {
		width: 282px;
		height: 218px;
		background: url(//cdn.aixifan.com/dotnet/20130418/project/404/style/image/404img.png)
			100% 0 no-repeat;
		background-size: cover;
	}
	.page-text {
		margin-top: 55px;
		text-align: left;
		width: 406px;
		padding-left: 30px;
		line-height: 24px;
		& > span {
			font-family: PingFangSC-Regular;
			font-size: 22px;
			color: #333;
			font-weight: 400;
		}
	}
}
</style>
