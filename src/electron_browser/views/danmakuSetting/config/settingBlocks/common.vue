<template>
	<row-frame title="一般设置" :flex="true">
		<row-span :span="5">
			最大回滚弹幕数量
		</row-span>
		<row-span :span="3">
			<el-input-number size="mini" v-model="setting.maxNum" />
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
