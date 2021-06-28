<template>
	<div class="imgInput" @click="getFile" :style="{'--fit':fit}">
		<div class="tips">
			<div class="icon el-icon-picture-outline" />
			<div>点击加载图片</div>
		</div>
		<el-image :lazy="true" class="cover" :src="src">
			<template #error>
				<div class="cover image-slot" />
			</template>
		</el-image>
	</div>
	<el-dialog custom-class="dialogBase" title="图片剪裁" v-model="clipDialog" @close="editImg=''">
		<vue-cropper v-if="clipDialog" style="max-height:300px" ref="cropper" :aspect-ratio="16 / 10" :src="editImg" alt="Source Image" />
		<span class="hint">鼠标滚轮进行缩放</span>
		<template #footer>
			<el-button type="primary" size="mini" @click="crop">确定</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { load } from "@front/util_function/file";
import { uploadBase64Image, path } from "@front/util_function/system";
import { BlobtoB64 } from "@front/util_function/imgTool";
import { ElMessage } from "element-plus";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
export default defineComponent({
	name: "imgInputClip",
	components: { VueCropper },
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
	data() {
		const editImg: any = "";
		return {
			clipDialog: false,
			editImg
		};
	},
	computed: {
		src(): any {
			return this.modelValue;
		}
	},
	methods: {
		async getFile() {
			const file: any = await load(".jpg,.png,.gif");
			if (file) {
				this.edit(file);
			}
		},
		edit(file: any) {
			BlobtoB64(file)
				.then(res => {
					this.editImg = res;
					this.clipDialog = true;
				})
				.catch(() => {
					ElMessage({
						message: "图片读取错误",
						duration: 1500,
						type: "error",
						offset: 60
					});
				});
		},
		crop() {
			// @ts-ignore
			const cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
			uploadBase64Image(cropImg)
				.then(url => {
					this.$emit(
						"update:modelValue",
						`/configFiles/images/${path.basename(url)}`
					);
					this.editImg = "";
					this.clipDialog = false;
				})
				.catch(() => {
					ElMessage({
						message: "图片保存失败",
						duration: 1500,
						type: "error",
						offset: 60
					});
				});
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
