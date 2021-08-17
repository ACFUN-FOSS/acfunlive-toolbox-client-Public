<template>
	<content-frame align="row" id="applets">
		<div class="appletList">
			<span class="hint">小程序比较耗内存 谨慎多开</span>
			<div v-for="(applet,index) in applets" class="appletRow" :key="index">
				<div class="block" :title="applet.cname">
					<div :class="applet.icon" />
				</div>
				<div class="desc">
					<div class="title">{{applet.cname}}</div>
					<div class="detail" :title="applet.description">{{applet.description||"暂无描述"}}</div>
					<div class="tags">
						<el-tag size="mini">{{applet.configurations.multiple?"":"不"}}可多开</el-tag>
						<el-tag size="mini">{{applet.configurations.liveOnly?"仅限直播":"非直播时可用"}}</el-tag>
						<el-tag size="mini" v-if="applet.configurations.hasObs">OBS联动</el-tag>
					</div>
				</div>
				<el-button class="start" type="primary" @click="startApplet(applet)" :disabled="applet.configurations.liveOnly&&$store.state.streamStatus.step!=='danmakuing'">启动</el-button>
			</div>
		</div>
	</content-frame>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { clientApplets as applets } from "@front/applets";
import { startApplet } from "@front/util_function/system";
export default defineComponent({
	name: "appletList",
	data() {
		return { applets };
	},
	methods: {
		startApplet
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/variables.scss";
@import "@front/styles/scrollbar.scss";

.appletList {
	position: absolute;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	@include scrollbarDark();
}
.appletRow {
	width: calc(100% - 8px);
	min-height: 80px;
	box-shadow: $--box-shadow-base;
	box-sizing: border-box;
	padding: 4px;
	margin: 8px 4px;
	display: flex;
	&:hover {
		color: $--color-primary;
		box-shadow: $--box-shadow-light;
	}
}
.block {
	height: 60px;
	width: 60px;
	border-radius: 4px;
	margin: 5px;
	display: flex;
	font-size: $--font-size-large;
	align-items: center;
	justify-content: center;
	border: $--border-base;
	color: $--color-text-secondary;
	flex-shrink: 0;
}
.desc {
	position: relative;
	width: calc(100% - 122px);
	padding: 4px;
	.title {
		color: $--color-text-primary;
	}
	.detail {
		color: $--color-text-secondary;
		width: 100%;
		word-break: break-all;
		text-overflow: ellipsis;
		margin-bottom: 4px;
	}
}
.start {
	margin: 5px;
	height: 60px;
	flex-shrink: 0;
	width: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.tags {
	& > * {
		margin-right: 8px;
	}
}
</style>
