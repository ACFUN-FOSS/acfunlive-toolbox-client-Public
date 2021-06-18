<template>
	<div class="buttonIcon" @click="minimize()"><span class="el-icon-minus" /></div>
	<div class="buttonIcon" @click="close()"><span class="el-icon-close" /></div>
</template>

<script>
import { minimize, close } from "@front/util_function/system";
import { defineComponent } from "vue";
export default defineComponent({
	name: "handlerWindow",
	methods: {
		minimize,
		close
	}
});
</script>
