<template>
	<div class="buttonIcon" @click="minimize()"><span class="el-icon-minus" /></div>
	<div class="buttonIcon" @click="closeConfirm()"><span class="el-icon-close" /></div>
</template>

<script>
import { minimize, close } from "@front/util_function/system";
import { defineComponent } from "vue";
import { ElMessageBox } from "element-plus";
export default defineComponent({
	name: "handlerWindow",
	methods: {
		minimize,
		close,
		closeConfirm() {
			ElMessageBox({
				title: "确认关闭？",
				showCancelButton: true,
				confirmButtonText: "确定",
				cancelButtonText: "取消"
			}).then(this.close);
		}
	}
});
</script>
