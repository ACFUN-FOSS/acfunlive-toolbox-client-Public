<template>
	<div class="img-input-text" :style="{'--fit':fit}">
		<span class="hint" style="margin-right:8px">{{modelValue?getBaseName(modelValue):"未选择图片"}}</span>
		<el-button @click="getFile" size="mini" type="primary">选择图片</el-button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { load } from "@front/util_function/file";
import { uploadImage, path } from "@front/util_function/system";
export default defineComponent({
	name: "imgInputText",
	props: {
		modelValue: {
			type: String,
			default: ""
		},
		fit: {
			type: String,
			default: "cover"
		}
	},
	methods: {
		getBaseName(url: string) {
			return path.basename(url);
		},
		async getFile() {
			const file: any = await load(".jpg,.png,.gif");
			if (file) {
				const url = await uploadImage(file.path);
				this.$emit(
					"update:modelValue",
					`/configFiles/images/${path.basename(url)}`
				);
			}
		}
	}
});
</script>

<style lang='scss'>
.img-input-text {
	position: relative;
	display: flex;
	align-content: center;
	vertical-align: middle;
}
</style>
