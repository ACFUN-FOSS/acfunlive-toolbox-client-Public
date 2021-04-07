<template>
	<title-frame id="streamMonitor" title="监控面板">
		<content-frame id="dashboard" align="column">
			<row-frame style="height:100%">
				<row-frame width="100%" title="房间信息">
					<row-span>
						<room-info />
					</row-span>
				</row-frame>
				<row-frame width="100%" title="功能开关" :flex="true">
					<row-span :span="6" style="margin-bottom:8px">
						<el-switch disabled active-text="鸡鸡人" />
					</row-span>
					<row-span :span="6" style="margin-bottom:8px">
						<el-switch disabled active-text="合并弹幕" />
					</row-span>
				</row-frame>
				<row-frame title="黑幕抽奖">
					<row-span>
					</row-span>
				</row-frame>
			</row-frame>
			<row-frame style="height:100%" title="弹幕流" :flex="true">
				<row-span :span="12">
					<danmaku-flow style="width:100%;height:550px;font-size:18px!important" />
				</row-span>
			</row-frame>
		</content-frame>
	</title-frame>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
const roomInfo = defineAsyncComponent(() => import("./roomInfo"));
const danmakuFlow = defineAsyncComponent(() =>
	import("@fe/components/danmakuSelf")
);
export default defineComponent({
	name: "streamMonitor",
	components: {
		roomInfo,
		danmakuFlow
	},
	data() {
		return {};
	},
	computed: {},
	watch: {},
	methods: {}
});
</script>
<style scoped lang='scss'>
#streamMonitor {
	width: 100%;
	height: 100%;
}
</style>
