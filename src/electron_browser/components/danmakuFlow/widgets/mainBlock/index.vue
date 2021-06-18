
<script lang="ts">
import { defineComponent } from "vue";
import defaultValue from "./default";
import form from "./form";
export default defineComponent({
	name: "mainBlock",
	cname: "弹幕背景",
	widgetOptions: {
		avaliable: [],
		limit: 1
	},
	props: {
		setting: {
			default: defaultValue()
		}
	},
	data() {
		return {
			settingValue: defaultValue,
			settingForm: form
		};
	}
});
</script>
