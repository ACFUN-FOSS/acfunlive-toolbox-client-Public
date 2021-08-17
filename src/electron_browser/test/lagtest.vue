<template>
	<div class="danmaku">
		<el-button @click="backendRestart">restart</el-button>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { backendRestart } from "@front/util_function/system";
export default defineComponent({
	cname: "重启测试",
	name: "restartTest",
	mounted() {
		setInterval(() => {
			console.log("调用重启");
			this.backendRestart();
		}, 1000);
	},
	methods: {
		backendRestart
	}
});
</script>
<style scoped lang='scss'>
.danmaku {
	width: 400px;
	padding: 5px;
	background-color: greenyellow;

	& > div {
		display: inline;
	}
}
</style>
