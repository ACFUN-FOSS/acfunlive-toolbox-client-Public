import { ComponentOptionsMixin } from "vue";
export const style: ComponentOptionsMixin = {
	computed: {
		generalStyle(): any {
			return this.$store.state.generalStyle;
		}
	}
};
export const config: ComponentOptionsMixin = {
	computed: {
		generalConfig(): any {
			return this.$store.state.generalConfig;
		}
	}
};
