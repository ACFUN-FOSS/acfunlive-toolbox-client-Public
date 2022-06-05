<template>
	<component v-bind="$attrs" :is="current" />
</template>

<script>
import normalRow from "./normalRow.vue";
import advanceRow from "./advanceRow.vue";
import { markRaw } from "vue";
export default {
	components: { normalRow, advanceRow },
	computed: {
		current() {
			if (this.$attrs.setting.advHtml) {
				return markRaw(advanceRow);
			}
			return markRaw(normalRow);
		}
	}
};
</script>
