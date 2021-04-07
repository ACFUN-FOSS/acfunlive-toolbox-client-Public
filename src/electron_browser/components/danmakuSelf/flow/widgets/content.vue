<template>
	<div class="content">
		{{getContent(danmaku)}}
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getContent } from "./danmakuGetter";
export default defineComponent({
	name: "timestamp",
	props: {
		danmaku: {
			required: true
		}
	},
	methods: {
		getContent(danmaku: any) {
			return getContent(danmaku);
		}
	}
});
</script>
<style scoped lang='scss'>
.content {
	color: white;
	text-shadow: -1px -1px 0 #000, 0 -1px 0 #000, 1px -1px 0 #000, 1px 0 0 #000,
		1px 1px 0 #000, 0 1px 0 #000, -1px 1px 0 #000, -1px 0 0 #000;
	word-break: break-all;
	word-wrap: break-word;
	max-width: 100%;
}
</style>
