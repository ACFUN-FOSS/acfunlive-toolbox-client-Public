<template>
	<el-select size="mini" v-model="value" placeholder="点击选择字体" :loading="loading">
		<el-option label="默认" value="" />
		<el-option v-for="item in fonts" :key="item.value" :label="item.label" :value="item.value" />
		<el-option label="点击上传" @click="uploadFont" />
	</el-select>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getFontList, uploadFont, path } from "@front/util_function/system";
import { load } from "@front/util_function/file";
export default defineComponent({
	name: "fontPicker",
	props: {
		modelValue: {
			default: ""
		}
	},
	data() {
		return {
			fonts: [],
			loading: false
		};
	},
	mounted() {
		this.remoteMethod();
	},
	computed: {
		value: {
			get(): string {
				return this.modelValue;
			},
			set(e: any) {
				this.$emit("update:modelValue", e);
			}
		}
	},
	methods: {
		remoteMethod() {
			getFontList().then((res: any) => {
				this.fonts = res.list;
			});
		},
		uploadFont() {
			load(".ttf").then(async (res: any) => {
				const result = await uploadFont(res.path);
				await this.remoteMethod();
				this.value = `/configFiles/fonts/${path.basename(result)}`;
			});
		}
	}
});
</script>

<style scoped lang='scss'>
</style>
