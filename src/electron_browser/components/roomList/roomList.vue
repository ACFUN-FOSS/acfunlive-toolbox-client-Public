<template>
	<div class="roomList">
		<el-tabs class="tabs" v-model="activeName">
			<el-tab-pane label="在线观众" name="first" />
			<el-tab-pane label="贡献榜" name="second" />
			<el-tab-pane label="守护榜" name="third" />
		</el-tabs>
		<div style="height:60px;transform:translateY(-10px);">
			<component :is="component" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, markRaw } from "vue";
import audienceList from "./audienceList.vue";
import donateList from "./donateList.vue";
import rankList from "./rankList.vue";
export default defineComponent({
	name: "roomList",
	data() {
		return {
			components: {
				first: markRaw(audienceList),
				second: markRaw(donateList),
				third: markRaw(rankList)
			},
			activeName: "first"
		};
	},
	computed: {
		component() {
			// @ts-ignore
			return this.components[this.activeName];
		}
	}
});
</script>
<style scoped lang='scss'>
@import "@front/styles/variables.scss";
.tabs {
	position: absolute;
	top: -62px;
	width: 100%;
	:deep .el-tabs__nav.is-top {
		float: left;
	}
	:deep .el-tabs__item {
		box-shadow: none !important;
	}
	:deep .el-tabs__header {
		margin: 0px !important;
	}
	:deep .el-tabs__content {
		display: none;
	}
}
</style>
