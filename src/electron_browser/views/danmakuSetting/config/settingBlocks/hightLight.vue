<template>
	<row-frame title="弹幕高亮（未完成）" :flex="true">
		<row-span :span="3">
			特别关心
		</row-span>
		<row-span :span="3">
			<el-select v-model="setting.hightLight.concerned" size="mini">
				<el-option v-for="i in switchOptions" :key="i.value" :value="i.value" :label="i.label" />
			</el-select>
		</row-span>
		<row-span :span="3">
			榜单前三
		</row-span>
		<row-span :span="3">
			<el-select v-model="setting.hightLight.boss" size="mini">
				<el-option v-for="i in switchOptions" :key="i.value" :value="i.value" :label="i.label" />
			</el-select>
		</row-span>
	</row-frame>
	<row-frame :flex="true">
		<row-span :span="3">
			房管
		</row-span>
		<row-span :span="3">
			<el-select v-model="setting.hightLight.manager" size="mini">
				<el-option v-for="i in switchOptions" :key="i.value" :value="i.value" :label="i.label" />
			</el-select>
		</row-span>
	</row-frame>
</template>

<script>
import { switchOptions } from "@front/datas/selections";
import { speedOptions } from "@front/components/danmakuFlow/utils/data";
import { defineComponent } from "vue";
export default defineComponent({
	props: {
		settings: {
			required: true
		},
		mockData: {
			default: () => {
				return [];
			}
		}
	},
	computed: {
		switchOptions,
		speedOptions,
		setting: {
			get() {
				return this.settings;
			},
			set(e) {
				this.$emit("update:settings", e);
			}
		}
	}
});
</script>

<style scoped lang='scss'>
</style>
