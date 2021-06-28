<template>
	<div class="imgInput" @mouseenter.prevent="showTips" @mouseleave.prevent="showTips" @mouseover.prevent="showTips" @drop="loadFile" @dragenter.prevent="showTips" @dragover.prevent="showTips" @click="getFile">
		<div class="tips" v-if="tips">
			<div class="icon el-icon-picture-outline" />
			<div>{{msg}}</div>
		</div>
		<input ref="file" type="file" v-show="false" accept=".jpg,.png,.gif" @change="loadFile" />
		<img class="cover" v-if="img" :src="img" />
		<div class="cover image-slot" v-else />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
	name: "imgInputBase",
	props: {
		src: {
			type: String,
			default: ""
		},
		editable: {
			type: Boolean,
			default: true
		}
	},
	data() {
		const blob: any = null;
		return {
			tips: false,
			msg: "",
			blob
		};
	},
	computed: {
		img: {
			get(): any {
				return this.src;
			},
			set(e: any): any {
				this.$emit("update:src", e);
			}
		}
	},
	methods: {
		showTips(e: any) {
			e.preventDefault();
			// console.log(e);
			if (!this.editable) {
				return;
			}
			if (e.type === "mouseleave" || e.type === "dragleave") {
				this.tips = false;
				return;
			}
			if (e.buttons === 1) {
				this.msg = "将照片拖到此处释放";
			} else {
				this.msg = "点击或将图片拖到此处";
			}
			this.tips = true;
		},
		getFile() {
			this.$el.querySelector("input").click();
		},
		loadFile(e: any) {
			let files = new File([""], "");
			if (e.dataTransfer) {
				for (let i = 0; i < e.dataTransfer.items.length; i++) {
					// If dropped items aren't files, reject them
					if (e.dataTransfer.items[i].kind === "file") {
						files = e.dataTransfer.items[i].getAsFile();
					}
				}
			} else {
				files = e.srcElement.files[0];
			}
			this.blob = files;
			const reader = new FileReader();
			reader.readAsDataURL(files);
			reader.onloadend = () => {
				this.img = reader.result;
			};
		}
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/variables.scss";
.imgInput {
	position: relative;
	min-width: 50px;
	min-height: 50px;
}
.cover {
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0px;
	top: 0px;
	cursor: pointer;
}
.image-slot {
	width: 100%;
	height: 100%;
	background-image: url("/imgs/common/noCover.jpg");
	background-repeat: no-repeat;
	background-position: center;
	background-color: white;
}
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
	font-size: $--font-size-medium;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.icon {
		font-size: 48px;
		padding: 8px;
	}
}
</style>
