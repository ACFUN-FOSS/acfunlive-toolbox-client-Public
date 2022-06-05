<template>
	<div class="danmaku">
		<div class="timestamp">13:12:02</div>
		<div class="medal">ACER</div>
		<div class="avatar"> 1</div>
		<div class="nickName">丢雷楼某</div>
		<div class="content">啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊我好喜欢阿婵啊啊啊啊啊啊啊啊</div>
		<div class="text">《-呵呵</div>
		<div class="absolute">贴纸</div>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { walk } from "@front/util_function/object";
import path from "path";
export default defineComponent({
	cname: "排版测试",
	name: "alignTest",
	data() {
		return {};
	},
	mounted() {
		const result = walk(this.$store.state.danmakuProfile);
		console.log(
			result.filter(i => typeof i === "string" && path.extname(i))
		);
	},
	methods: {}
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
