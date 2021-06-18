<template>
	<div class="test">
		<el-button type="primary" @click="toJSON">弹幕过滤并导出json</el-button>
		<el-button type="primary" @click="merge">合并弹幕</el-button>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { toJSON } from "@front/util_function/exportTo";
import { load } from "@front/util_function/file";
// import danmaku from "./danmaku.json";
export default defineComponent({
	name: "cleanDanmu",
	cname: "弹幕筛选",
	data() {
		return {
			danmaku: []
		};
	},
	computed: {},
	watch: {},
	mounted() {
		console.log(this.danmaku);
	},
	methods: {
		toJSON() {
			load(".json").then(res => {
				const arr = JSON.parse(res);
				if (res && res.length) {
					this.filter(arr);
				}
			});
		},
		filter(arr) {
			const danmakuType = {
				1000: 0,
				1001: 0,
				1002: 0,
				1003: 0,
				1005: 0,
				1007: 0
			};
			const output = [];
			arr.forEach((item, index) => {
				if (
					danmakuType[item.type] !== undefined &&
					danmakuType[item.type] < 50
				) {
					output.push(item);
					danmakuType[item.type]++;
				}
			});
			toJSON("filtered", output);
		},
		async merge() {
			const res1 = JSON.parse(await load(".json"));
			const res2 = JSON.parse(await load(".json"));
			if (!Array.isArray(res1) || !Array.isArray(res2)) {
				return;
			}
			this.filter([...res1, ...res2]);
		}
	}
});
</script>

<style scoped lang='scss'>
</style>
