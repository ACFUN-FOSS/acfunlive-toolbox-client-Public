<template>
	<row-frame title="一般设置" :flex="true">
		<row-span :span="6">
			最大回滚弹幕数量
		</row-span>
		<row-span :span="2">
			<el-input-number size="mini" v-model="setting.maxNum" />
		</row-span>
		<row-span :span="6">
			弹幕方向
		</row-span>
		<row-span :span="6">
			<el-select v-model="setting.direction" size="mini">
				<el-option label="新弹幕在下" value="addToBottom" />
				<el-option label="新弹幕在上" value="addToTop" />
			</el-select>
		</row-span>
		<span class="hint">请根据机器性能自行调节</span>
	</row-frame>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	props: {
		settings: {
			required: true
		}
	},
	computed: {
		setting: {
			get(): any {
				return this.settings;
			},
			set(e: any) {
				this.$emit("update:settings", e);
			}
		}
	}
});
</script>

<style scoped lang='scss'>
</style>
