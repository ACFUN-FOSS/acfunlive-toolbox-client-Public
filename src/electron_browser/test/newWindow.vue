<template>
	<div class="danmaku">
		<a :href="`https://live.acfun.cn/live/${1}`" target='_blank'>
			<el-button @click="test">测试</el-button>
		</a>
	</div>
</template>

<script>
import { defineComponent } from "vue";
// import lzwCompress from "lzwcompress";
import { load } from "@front/util_function/file";
export default defineComponent({
	cname: "新开窗口",
	name: "newWindow",
	data() {
		return {};
	},
	computed: {},
	watch: {},
	methods: {
		test() {
			load(".json").then(res => {
				const unregiste = JSON.parse(res);
				console.log(unregiste);
				// console.log(lzwCompress.pack(unregiste));
			});
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
