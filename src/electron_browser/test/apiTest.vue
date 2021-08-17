<template>
	<div class="danmaku">
		<!-- <el-input type="number" v-model="uid" /> -->
		<el-button @click="test()">发送数据</el-button>
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
			const xhr = new XMLHttpRequest();

			xhr.open(
				"GET",
				"http://music.163.com/api/playlist/detail?id=2557908184"
			);
			// xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			// xhr.setRequestHeader(
			// 	"Content-Type",
			// 	"application/x-www-form-urlencoded; charset=UTF-8"
			// );
			xhr.onloadend = () => {
				console.log(JSON.parse(xhr.responseText));
			};
			xhr.send(null);
		}
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
