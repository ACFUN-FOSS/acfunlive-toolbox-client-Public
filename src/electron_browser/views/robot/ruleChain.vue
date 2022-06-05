<template>
	<span>
		<span class="rule" v-for="(rule,index) in value" :key="index">
			<span class="el-icon-error remove" @click="value = value.filter(i=>i!=rule)" />
			<el-input style="width:150px;margin-right:8px;margin-top:8px" v-model="rule.value" size="mini"
				v-if="rule.type=='text'" />
			<el-select style="width:150px;margin-right:8px;margin-top:8px" v-model="rule.value" size="mini"
				v-else-if="rule.type=='variable'">
				<el-option v-for="getterOption in getterOptions" v-show="getterOption.avaliable.includes(allow)"
					:label="getterOption.label" :key="getterOption.value" :value="getterOption.value" />
			</el-select>
			<el-select style="width:150px;margin-right:8px;margin-top:8px" v-model="rule.value" size="mini" v-else>
				<el-option v-for="(voice,index) in voiceList" :label="voice.label" :key="index" :value="voice.value" />
			</el-select>
		</span>
		<el-dropdown @command="addCommand" type="primary" trigger="click" style="line-height:28px">
			<el-button size="mini" type="primary" style="margin-right:8px;margin-top:8px">添加</el-button>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="text">文本</el-dropdown-item>
					<el-dropdown-item command="voice">音频</el-dropdown-item>
					<el-dropdown-item command="variable">变量</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>

	</span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getterOptions } from "@front/components/danmakuFlow/utils/getter";
export default defineComponent({
	name: "ruleChain",
	props: {
		modelValue: {
			default: () => {
				return [];
			}
		},
		voiceList: {
			default: () => {
				return [];
			}
		},
		allow: {
			default: 1000
		}
	},
	computed: {
		getterOptions,
		value: {
			get(): Array<any> {
				return this.modelValue;
			},
			set(e: any) {
				this.$emit("update:modelValue", e);
			}
		}
	},
	methods: {
		addCommand(command: any) {
			this.value.push({
				type: command
			});
		}
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/variables.scss";
.rule {
	position: relative;
	.remove {
		display: none;
	}
	&:hover {
		.remove {
			display: block;
			color: $--color-danger;
			font-size: $--font-size-extra-large;
			position: absolute;
			top: 0px;
			right: 0px;
			transform: translateX(0%) translateY(-50%);
			z-index: 100;
			cursor: pointer;
		}
	}
}
</style>
