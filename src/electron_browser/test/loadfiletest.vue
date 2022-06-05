<template>
	<div class="danmaku">
		<el-button @click="load">加载</el-button>
		<el-button @click="save">保存</el-button>
	</div>
</template>

<script>
import { load, save } from "@front/util_function/system";
import { defineComponent } from "vue";
export default defineComponent({
	cname: "文件指定加载测试",
	name: "loadfileTest",
	data() {
		return {};
	},
	computed: {},
	watch: {},
	methods: {
		load() {
			load({ url: "./test.json" }).then(res => {
				console.log(res);
			});
		},
		save() {
			save({ url: "./recordList.json", data: { test: 123 } });
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
