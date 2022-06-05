<template>
	<div class="test">
		<el-button type="primary" @click="getCacheSize">获取缓存大小</el-button>
		<el-button type="primary" @click="removeCache">清理缓存</el-button>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { getCacheSize, removeCache } from "@front/util_function/system";
import { walk } from "@front/util_function/object";
import path from "path";
import uniq from "lodash/uniq";
export default defineComponent({
	name: "cleanCache",
	cname: "缓存清理",
	data() {
		return {
			danmaku: []
		};
	},
	computed: {},
	watch: {},
	// mounted() {},
	methods: {
		getCacheSize() {
			getCacheSize().then(res => {
				console.log(res);
			});
		},
		removeCache() {
			const keepList = walk(this.$store.state.danmakuProfile, value => {
				try {
					return path.extname(value);
				} catch (error) {
					return false;
				}
			});
			removeCache(uniq(keepList)).then(res => {
				console.log(res);
			});
		}
	}
});
</script>

<style scoped lang='scss'>
</style>
