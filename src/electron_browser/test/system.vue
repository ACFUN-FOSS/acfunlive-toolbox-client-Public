<template>
	<div class="danmaku">
		<el-button @click="getAppMetrics">内存情况</el-button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// const { ipcRenderer }: any = window.require("electron");
export default defineComponent({
	cname: "系统性能记录",
	name: "systemRecord",
	methods: {
		getAppMetrics() {
			// ipcRenderer?.send("getAppMetrics");
			// ipcRenderer?.once("getAppMetrics-complete", (e: any, data: any) => {
			// 	console.log(JSON.parse(data));
			// });
		}
	}
});
</script>
<style scoped lang='scss'>
.danmaku {
	width: 400px;
	padding: 5px;
}
</style>
