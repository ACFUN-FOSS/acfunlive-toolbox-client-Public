<!--
 ! AcFunlive toolbox client, AcFun直播工具箱的客戶端
 ! 版權所有 (C) 2020 ACFUN-FOC(ACFUN自由與開源9課)
 ! 此程序爲自由軟件：本程序遵守自由軟件聯盟(FSF)所發佈之GNU Affero通用公共許可第三版。
 ! 在此條約下、伱可以再發行・修改之。
 ! 我等開發者希望本程序能是實用的軟件、竝心懷如此願望而發佈。但此程序
 ! ！       ！       ！       ！
 ! 無       有       擔       保  。
 ! ！       ！       ！       ！
 ! 無 有 任 何 擔 保 。甚至不保證它能有用・能對伱產生經濟效益。
 ! 伱應該收到了一份GNU Affero通用公共許可第三版、它伴隨着本程序。若伱沒有收到，請查閱
 ! <http://www.gnu.org/licenses/>。同時提供伱的電子郵寄地址或傳統的郵件聯繫方式。
-->

<template>
	<div id="app" :style="generalStyle" :class="{logined:$store.state.isLogined}">
		<router-view v-slot="{ Component }">
			<transition name="fade_transform" mode="out-in">
				<component :is="Component" />
			</transition>
		</router-view>
	</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { logout } from "@fe/utils/login";
export default defineComponent({
	name: "app",
	computed: {
		generalStyle() {
			return this.$SM.initCssVar(
				this.$store.state.generalStyle,
				"--generalStyle"
			);
		}
	},
	mounted() {
		window.onbeforeunload = () => {
			logout();
		};
	}
});
</script>
<style lang="scss">
@import "@fe/assets/scss/base";
html,
body {
	margin: 0px;
	padding: 0px;
	width: 100%;
	height: 100%;
	background-color: transparent !important;
	position: absolute;
	box-sizing: border-box;
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	width: calc(100% - 24px);
	height: calc(100% - 24px);
	font-size: var(--generalStyle_fontSize_B);
	margin: 12px;
	box-shadow: var(--generalStyle_shadow_deep);
	position: absolute;
	background-color: var(--generalStyle_color_primary);
	transition: all 0.5s;
	&.logined {
		background-color: var(--generalStyle_color_background);
	}
	left: 0px;
	top: 0px;
	border-radius: var(--generalStyle_radius_small);
	overflow: hidden;
	box-sizing: border-box;
}
</style>
