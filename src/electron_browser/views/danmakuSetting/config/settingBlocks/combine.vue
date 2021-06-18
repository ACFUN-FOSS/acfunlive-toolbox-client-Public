<template>
	<row-frame title="弹幕合并" :flex="true">
		<row-span :span="3" :class="{disabled:!setting.filter.open}">
			礼物连击
		</row-span>
		<row-span :span="3">
			<el-switch :disabled="!setting.filter.open" v-model="setting.filter.combineGift" />
		</row-span>
		<row-span :span="3" :class="{disabled:!setting.filter.open}">
			点赞
		</row-span>
		<row-span :span="3">
			<el-switch :disabled="!setting.filter.open" v-model="setting.filter.combineLike" />
		</row-span>
		<div class="hint">合并：针对一定时期内相同用户发出的相同类型弹幕进行合并，效果只能在实际直播时查看</div>
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
