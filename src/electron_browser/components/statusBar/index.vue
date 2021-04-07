<template>
	<div id="statusBar" :class="{unfold:isUnfold}" element-loading-background="rgba(0, 0, 0, 0)">
		<div class="switch" @click="unfold" v-if="$store.getters.streamMonitor"><span
				class="el-icon-arrow-up" />{{isUnfold?'折叠':'展开'}}</div>

		<transition name="fade">
			<component :is="currentComp" />
		</transition>
	</div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";
import { room } from "@fe/api/ws_h";
const mainPanel = defineAsyncComponent(() =>
	import("@fe/views/streamMonitor/index.vue")
);
const shrink = defineAsyncComponent(() =>
	import("@fe/views/streamMonitor/shrink.vue")
);

export default defineComponent({
	name: "statusBar",
	components: {
		mainPanel,
		shrink
	},
	data() {
		const checkTimeout: any = -1;
		return {
			isUnfold: false,
			checkTimeout
		};
	},
	created() {
		this.$Event.on("routeChange", this.unfold);
		this.$Event.on("roomStatusChanged", this.checkStatus);
	},
	mounted() {
		this.$store.dispatch("checkStreamStatus");
		this.checkStatus(null);
	},
	beforeUnmount() {
		this.$Event.off("roomStatusChanged", this.checkStatus);
		this.$Event.off("routeChange", this.unfold);
	},
	computed: {
		...mapGetters(["streamMonitor"]),
		...mapState(["roomProfile"]),
		api() {
			return this.$store.state.api;
		},
		currentComp() {
			if (this.isUnfold) {
				return mainPanel;
			}
			if (!this.isUnfold) {
				return shrink;
			}
			return null;
		}
	},
	methods: {
		unfold(e: any) {
			if (!this.streamMonitor) {
				this.isUnfold = false;
				return;
			}
			if (!e.name) {
				this.isUnfold = !this.isUnfold;
				return;
			}
			this.isUnfold = e.name === "statusPanel";
		},
		checkStatus(res: room.profileDetail | null | undefined) {
			console.log("===================");
			console.log(res);
			if (!res) {
				this.isUnfold = Boolean(this.roomProfile.liveID);
			} else {
				this.isUnfold = Boolean(res!.liveID);
			}
		}
	}
});
</script>

<style scoped lang='scss'>
#statusBar {
	width: 100%;
	height: 100%;
	position: absolute;
	bottom: 0px;
	transition: all 0.5s;
	transform: translateY(calc(100% - 70px));
	border-top: 1px solid var(--generalStyle_fontColor_Third);
	background-color: var(--generalStyle_color_background);
	&.unfold {
		// border-color: rgba(0, 0, 0, 0);
		transform: translateY(0px);
		.switch span {
			transform: rotateZ(180deg);
		}
	}
	.switch {
		position: absolute;
		top: 8px;
		right: 25px;
		z-index: 10;
		color: var(--generalStyle_fontColor_Second);
		user-select: none;
		cursor: pointer;
		transition: all 0.25s;
		&:hover {
			color: var(--generalStyle_fontColor_First);
		}
		span {
			transition: all 0.25s;
		}
	}
}
</style>
