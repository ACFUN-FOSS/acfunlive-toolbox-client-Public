<template>
	<div>
		<el-tabs class="tabs" v-model="activeTo">
			<el-tab-pane label="功能" name="first" />
			<el-tab-pane label="样式编辑" name="second" />
			<el-tab-pane label="代码级样式编辑" name="third" />
			<el-tab-pane label="外挂弹幕姬" name="forth" />
		</el-tabs>
		<div style="height:504px">
			<component :is="components[activeTo]" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, markRaw } from "vue";
import styleConfig from "./style/index.vue";
import styleAdvance from "./styleAdvance/index.vue";
import styleSelf from "./styleSelf/index.vue";
import danmakuConfig from "./config/index.vue";
export default defineComponent({
	name: "danmakuConfig",
	data() {
		return {
			components: {
				first: markRaw(danmakuConfig),
				second: markRaw(styleConfig),
				third: markRaw(styleAdvance),
				forth: markRaw(styleSelf)
			},
			activeTo: "first"
		};
	}
});
</script>
<style scoped lang='scss'>
@import "@front/styles/variables.scss";
.tabs {
	position: absolute;
	top: -62px;
	right: 0px;
	width: calc(100% - 50px);
	:deep .el-tabs__nav.is-top {
		float: right;
	}
	:deep .el-tabs__item {
		box-shadow: none !important;
	}
	:deep .el-tabs__content {
		display: none;
	}
}
</style>
