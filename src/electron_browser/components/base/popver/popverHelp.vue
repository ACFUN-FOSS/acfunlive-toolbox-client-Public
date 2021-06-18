<template>
	<el-popover v-bind="$attrs">
		<template #reference>
			<span class="el-icon-question" />
		</template>
		<slot />
	</el-popover>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
	name: "popverHelp"
});
</script>

<style scoped lang='scss'>
</style>
