<template>
	<div class="buttonIcon" @click="sy.minimize()"><span class="el-icon-minus" /></div>
	<div class="buttonIcon" @click="sy.close()"><span class="el-icon-close" /></div>
</template>

<script>
import { SysMethods } from "@fe/api/sysMethods";
import { defineComponent } from "vue";
export default defineComponent({
	name: "handlerWindow",
	data() {
		return {
			sy: new SysMethods()
		};
	}
});
</script>
