<template>
	<div class="danmaku">
		<el-button @click="test" class="timestamp">点击</el-button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	cname: "storecommit测试",
	name: "commit",
	methods: {
		test() {
			this.$store.commit("getManagerList");
		}
	}
});
</script>
<style scoped lang='scss'>
.danmaku {
	width: 100%;
	height: 100%;
	padding: 5px;
	background-color: greenyellow;

	& > div {
		display: inline;
	}
}
</style>
