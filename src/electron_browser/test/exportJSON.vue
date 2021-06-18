<template>
	<div class="test">
		<el-button type="primary" @click="toJSON('danmaku',danmakuList)">aaaa</el-button>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import { toJSON } from "@front/util_function/exportTo";
import { mapGetters } from "vuex";
export default defineComponent({
	cname: "弹幕导出json",
	name: "test",
	data() {
		return {};
	},
	computed: {
		...mapGetters(["danmakuList"])
	},
	watch: {},
	methods: { toJSON }
});
</script>

<style scoped lang='scss'>
</style>
