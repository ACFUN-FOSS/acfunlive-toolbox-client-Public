<template>
	<div class="imgInput" @click="getFile" :style="{'--fit':fit}">
		<div class="tips">
			<div class="icon el-icon-picture-outline" />
			<div>点击加载图片</div>
		</div>
		<el-image class="cover" :src="modelValue">
			<template #error>
				<div class="cover image-slot" />
			</template>
		</el-image>

	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { load } from "@front/util_function/file";
import { uploadImage, path } from "@front/util_function/system";
export default defineComponent({
	name: "imgInputStatic",
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
@import "@front/styles/variables.scss";
.imgInput {
	position: relative;
	min-width: 60px;
	min-height: 60px;

	.tips {
		width: 100%;
		height: 100%;
		position: absolute;
		pointer-events: none;
		left: 0px;
		top: 0px;
		z-index: 10;
		user-select: none;
		background-color: rgba(0, 0, 0, 0.8);
		color: $--color-primary;
		font-size: $--font-size-base;
		display: none;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.icon {
			font-size: $--font-size-extra-large;
			padding: 8px;
		}
	}
	&:hover {
		.tips {
			display: flex;
		}
	}
	.cover {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0px;
		top: 0px;
		cursor: pointer;
		.el-image__inner {
			object-fit: var(--fit);
		}
	}

	.image-slot {
		width: 100%;
		height: 100%;
		background-image: url("/imgs/common/noCover.jpg");
		background-repeat: no-repeat;
		background-position: center;
		background-color: white;
	}
}
</style>
