<template>
	<div class="danmaku">
		<el-button @click="test">测试</el-button>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { appletList } from "@front/util_function/system";
export default defineComponent({
	cname: "小程序列表测试",
	name: "appletListTest",
	methods: {
		test() {
			appletList().then(res => {
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

	& > div {
		display: inline;
	}
}
</style>
