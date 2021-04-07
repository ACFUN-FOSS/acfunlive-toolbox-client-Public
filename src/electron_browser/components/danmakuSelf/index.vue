<template>
	<div class="danmakuFlow">
		<div class="rank">
		</div>
		<div class="tips"></div>
		<flow />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import flow from "./flow/index.vue";
export default defineComponent({
	name: "danmakuFlow",
	props: {
		options: {
			default: {
				online: true,
				top: true,
				donate: true,
				medal: true
			}
		}
	},
	components: { flow },
	data() {
		return {};
	},
	computed: {},
	watch: {},
	methods: {}
});
</script>
<style scoped lang='scss'>
.danmakuFlow {
	display: block;
}
</style>
