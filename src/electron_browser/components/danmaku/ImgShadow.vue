<template>
	<yt-img-shadow class="no-transition" :height="height" :width="width" style="background-color: transparent;" loaded>
		<img id="img" class="style-scope yt-img-shadow" alt="" :height="height" :width="width" :src="showImgUrl"
			@error="onLoadError">
	</yt-img-shadow>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
	name: "ImgShadow",
	props: {
		imgUrl: String,
		height: String,
		width: String
	},
	data() {
		return {
			showImgUrl: this.imgUrl
		};
	},
	watch: {
		imgUrl(val) {
			this.showImgUrl = val;
		}
	},
	methods: {
		onLoadError() {
			if (
				this.showImgUrl !==
				"https://tx-free-imgs.acfun.cn/style/image/defaultAvatar.jpg"
			) {
				this.showImgUrl =
					"https://tx-free-imgs.acfun.cn/style/image/defaultAvatar.jpg";
			}
		}
	}
});
</script>

<style src="./style/yt-img-shadow.css"></style>
