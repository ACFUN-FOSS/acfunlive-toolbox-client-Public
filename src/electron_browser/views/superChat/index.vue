<template>
	<div>
		<el-tabs class="tabs" v-model="activeTo">
			<el-tab-pane label="功能" name="first" />
			<el-tab-pane label="样式编辑器" name="second" />
		</el-tabs>
		<div style="height:504px">
			<component :is="components[activeTo]" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, markRaw } from "vue";
import styleConfig from "./style/index.vue";
import superChatConfig from "./config/index.vue";
export default defineComponent({
	name: "superChat",
	data() {
		return {
			components: {
				first: markRaw(superChatConfig),
				second: markRaw(styleConfig)
			},
			activeTo: "first"
		};
	}
});
</script>
<style scoped lang='scss'>
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
