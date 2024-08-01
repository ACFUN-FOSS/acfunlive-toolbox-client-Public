<template>
	<div class="danmaku">
		<!-- <el-input type="number" v-model="uid" /> -->
		<el-button @click="test">发送数据</el-button>
	</div>
</template>

<script>
/* eslint-disable */
import { defineComponent } from "vue";
import { streamInfo } from "@front/api/user";
export default defineComponent({
	cname: "接口测试",
	name: "apiTest",
	data() {
		return {
			uid: ""
		};
	},
	computed: {},
	watch: {},
	methods: {
		test() {
			const evtSource = new EventSource(
				"http://localhost:1299/api/login"
			);
			evtSource.onmessage = e => {
				console.log(JSON.parse(e.data));
			};
		}
	}
});
</script>
<style scoped lang="scss">
.danmaku {
	width: 400px;
	padding: 5px;
	background-color: greenyellow;

	& > div {
		display: inline;
	}
}
</style>
