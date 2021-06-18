<template>
	<div style="width:200px;height:100px">
		<font-picker v-model="color" />
	</div>
</template>

<script >
import { defineComponent } from "vue";
import fontPicker from "@front/components/form/fontPicker";
export default defineComponent({
	cname: "组件测试",
	name: "compTest",
	components: { fontPicker },
	data() {
		return {
			color: ""
		};
	}
});
</script>

<style scoped lang='scss'>
</style>
