<template>
	<div class="danmaku">
		<el-input type="number" v-model="uid" />
		<el-button @click="test">发送数据</el-button>
	</div>
</template>

<script>
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
			streamInfo({
				userID: 214844
			}).then(res => {
				console.log(res);
			});
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
