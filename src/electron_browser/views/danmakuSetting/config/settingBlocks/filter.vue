<template>
	<row-frame title="过滤器" :flex="true">
		<row-span :span="3">
			开启过滤
		</row-span>
		<row-span :span="3">
			<el-switch v-model="setting.filter.open" />
		</row-span>
		<!-- <row-span :span="3" :class="{disabled:!setting.filter.open}">
			游客过滤
		</row-span> -->
		<!-- <row-span :span="3">
			<el-switch v-model="setting.filter.visitor" :disabled="!setting.filter.open" />
		</row-span> -->
	</row-frame>
	<row-frame :flex="true">
		<row-span :span="3" :class="{disabled:!setting.filter.open}">
			牌子过滤
		</row-span>
		<row-span :span="3">
			<el-switch v-model="setting.filter.clubOnly" :disabled="!setting.filter.open" />
		</row-span>
		<row-span :class="{disabled:!(setting.filter.open)}" :span="3">
			等级过滤
		</row-span>
		<row-span :span="3">
			<el-input-number :disabled="!(setting.filter.open)" style="margin-left:8px" v-model="setting.clubLevel" :min="0" :step="1" size="mini" />
		</row-span>
		<div class="hint">牌子过滤：只显示挂主播牌子的弹幕（主播没牌子则不生效）；<br>
			等级过滤：只显示大于一定等级的牌子的弹幕</div>
	</row-frame>
	<row-frame :flex="true">
		<row-span :span="3" :class="{disabled:!setting.filter.open}">
			黑名单
		</row-span>
		<row-span :span="3">
			<el-switch :disabled="!setting.filter.open" v-model="setting.filter.blackList" />
		</row-span>
		<row-span :span="3" :class="{disabled:!setting.filter.open}">
			关键词屏蔽
		</row-span>
		<row-span :span="3">
			<el-switch :disabled="!setting.filter.open" v-model="setting.filter.keyword" />
		</row-span>
	</row-frame>
	<row-frame :flex="true">
		<row-span :span="3" :class="{disabled:!setting.filter.open}">
			弹幕显示
		</row-span>
		<row-span :span="9" v-show="setting.filter.blackList">
			<el-select :disabled="!setting.filter.open" v-model="setting.filter.types" multiple size="mini" style="width:100%" placeholder="多选显示弹幕类型">
				<el-option v-for="type in typeOptions" :label="type.label" :value="type.value" :key="type.value" />
			</el-select>
		</row-span>
	</row-frame>
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
	</row-frame>
	<row-frame title="" :flex="true">
		<row-span :span="3" :class="{disabled:!setting.filter.open}">
			进入直播间
		</row-span>
		<row-span :span="3">
			<el-switch :disabled="!setting.filter.open" v-model="setting.filter.combineEnter" />
		</row-span>
		<div class="hint">合并：针对一定时期内相同用户发出的相同类型弹幕进行合并</div>
	</row-frame>

</template>

<script lang="ts">
import { typeOptions } from "@front/components/danmakuFlow/utils/data";
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
		typeOptions,
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
