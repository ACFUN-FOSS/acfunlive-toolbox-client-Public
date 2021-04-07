<template>
	<div class="nickName">{{getNickName(danmaku)}} </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getNickName } from "./danmakuGetter";
export default defineComponent({
	name: "timestamp",
	props: {
		danmaku: {
			required: true
		}
	},
	methods: {
		getNickName(danmaku: any) {
			return getNickName(danmaku);
		}
	}
});
</script>
<style scoped lang='scss'>
.nickName {
	color: rgba(228, 182, 125);
	text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000,
		1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000, -1px 0 0 #000;
}
</style>
