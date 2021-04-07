<template>
	<content-frame id="dashboard" align="column">

		<row-frame content-class="welcome">
			<div class="boardContent">
				<h1>欢迎</h1>
				<p>亲爱的 {{$store.state.userProfile.nickname}} :</p>
				<p>{{generalConfig.welcomeDesc}}</p>
			</div>
		</row-frame>
		<row-frame :content-default-class="true" title="使用说明">
			<div class="boardContent">
				当前就一个开播功能，应该很简单吧
			</div>
		</row-frame>
		<row-frame :content-default-class="true" title="更新计划">
			<div class="boardContent">
				<ol>
					<li>弹幕姬（完全重写、高细粒度样式自定义、显示优化）</li>
					<li>常用功能移植（抽奖等）</li>
					<li>插件扩展支持</li>
				</ol>
			</div>
		</row-frame>
		<row-frame :content-default-class="true" title="其它相关">
			<div class="boardContent">AC在 爱也在</div>
		</row-frame>
	</content-frame>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { config } from "@fe/mixins/mixin";
export default defineComponent({
	name: "dashboard",
	mixins: [config],
	data() {
		return {};
	},
	computed: {},
	watch: {},
	methods: {}
});
</script>

<style scoped lang="scss">
#dashboard {
	&::before {
		content: "";
		position: absolute;
		width: 100%;
		height: calc(100% - 32px);
		background-image: url(/imgs/gif/acniang1.gif);
		background-repeat: no-repeat;
		background-position: left bottom;
		background-size: 50%;
		transform: scaleX(-1);
		opacity: 0.2;
		padding-bottom: 8px;
	}
	:deep .welcome {
		color: var(--generalStyle_fontColor_First);
		& > h1 {
			margin-top: 0px;
		}
	}
	.boardContent {
		padding: 8px;
	}
}
</style>
