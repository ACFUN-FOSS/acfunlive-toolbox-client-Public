<template>
	<flow :config="true" />
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "vuex";
import flow from "./flow/index";
export default defineComponent({
	name: "webDanmaku",
	components: {
		flow
	},
	mounted() {
		this.$store.state.userSession.userID = parseInt(this.$route.query.id);
		if (!this.$SM.isElectron()) {
			this.getDanmaku();
		}
	},
	computed: {
		...mapState(["api"])
	},
	methods: {
		async getDanmaku() {
			if (!this.$store.state.serverOnline) {
				await this.$store.dispatch("startServe");
			}
			await this.api.login({
				account: "",
				password: ""
			});
			this.$store.state.isLogined = true;
			this.$store.commit("getDanmaku");
		}
	}
});
</script>
<style lang='scss'>
html,
body,
#app {
	background-color: transparent;
	min-width: 0px;
	min-height: 0px;
	width: 100%;
	height: 100%;
}
#app {
	margin: 0px;
	width: 100%;
	height: 100%;
	transition: none;
}
</style>
