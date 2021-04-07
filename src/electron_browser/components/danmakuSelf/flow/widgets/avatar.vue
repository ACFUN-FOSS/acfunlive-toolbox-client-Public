<template>
	<div class="avatar" :style="`background-image:url(${getAvatar(danmaku)})`" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAvatar } from "./danmakuGetter";
export default defineComponent({
	name: "timestamp",
	props: {
		danmaku: {
			required: true
		}
	},
	methods: {
		getAvatar(danmaku: any) {
			return getAvatar(danmaku);
		}
	}
});
</script>
<style scoped lang='scss'>
.avatar {
	width: 25px;
	height: 25px;
	border-radius: 100px;
	background-position: center;
	background-size: 100%;
	margin: 0px 4px;
	border: 1px solid black;
}
</style>
