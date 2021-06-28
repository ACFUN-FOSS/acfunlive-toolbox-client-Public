<template>
	<div class="shotcut">
		<row-frame width="100%" title="快捷功能" :flex="true">
			<row-span :span="3.2" style="margin-bottom:8px">
				<a style="text-decoration:none;color:white" :href="`https://live.acfun.cn/live/${userSession.userID}`" target="_blank">
					<el-button type="primary" size="mini">网页直播间</el-button>
				</a>
			</row-span>
			<row-span :span="2" style="margin-bottom:8px">
				<el-button type="primary" size="mini" @click="closeStream">下播</el-button>
			</row-span>
			<row-span :span="4" style="margin-bottom:8px">
				<el-button type="primary" size="mini" @click="$store.commit('minify')">迷你化</el-button>

			</row-span>
		</row-frame>

	</div>

</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { closeStream } from "@front/mixins/methods";
export default defineComponent({
	name: "shotcut",
	mixins: [closeStream],
	data() {
		return {};
	},
	computed: {
		...mapState(["userSession"])
	},
	watch: {},
	methods: {}
});
</script>
<style lang="scss" scoped>
</style>
