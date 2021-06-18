<template>
	<div class="danmaku">
		<el-button @click="load">加载</el-button>
		<el-button @click="save">保存</el-button>
	</div>
</template>

<script>
import { loadConfig, saveConfig } from "@front/util_function/system";
import { defineComponent } from "vue";
export default defineComponent({
	cname: "文件加载测试",
	name: "loadTest",
	data() {
		return {};
	},
	computed: {},
	watch: {},
	methods: {
		load() {
			loadConfig().then(res => {
				console.log(res);
			});
		},
		save() {
			saveConfig(this.$store.state.danmakuProfile);
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
