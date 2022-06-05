<template>
	<div id="login">
		<topbar-base class="topbar" />
		<transition name="fade" mode="out-in">
			<div class="panel" v-if="!welcome">
				<hero-base class="hero" />
				<div class="form">
					<div class="row">
						<el-input
							v-model="userData.account"
							:disabled="logining"
							@keypress.enter="login()"
							placeholder="A站账号手机号/邮箱"
						/>
					</div>
					<div class="row">
						<el-input
							type="password"
							v-model="userData.password"
							:disabled="logining"
							@keypress.enter="login()"
							placeholder="A站密码"
						/>
					</div>
					<div class="row sep">
						<div>
							<el-checkbox
								class="logCheck"
								v-model="userData.disclaimerCheck"
								:disabled="logining"
							/>
							同意 ><el-button
								type="text"
								class="buttonText"
								@click="disclaimerDialog = true"
								:disabled="logining"
								>免责声明
							</el-button>
						</div>
						<div>
							<el-checkbox
								class="logCheck"
								v-model="userData.keepLogined"
								:disabled="logining"
							/>
							保持登录
						</div>
					</div>
					<div class="row">
						<el-button
							type="primary"
							:disabled="loginDisabled"
							class="logBtn"
							@click="login(true)"
							>登陆
						</el-button>
					</div>
					<div class="row logText">
						<transition name="fade" mode="out-in">
							<div :key="loginText">{{ loginText }}</div>
						</transition>
					</div>
				</div>
			</div>
			<div class="welcome" v-else>
				<img
					class="welcomeLogo"
					:src="`${loginTexts.welcomeLogo}?a=${welcomeLogoKey}`"
				/>
				<div class="welcomeText">{{ loginTexts.welcomeText }}</div>
			</div>
		</transition>
		<footer-base class="foter right" />
		<el-dialog
			custom-class="dialogBase"
			title="免责声明"
			v-model="disclaimerDialog"
		>
			<div>{{ loginTexts.disclaimer }}</div>
			<template #footer>
				<el-button
					type="primary"
					size="mini"
					@click="
						userData.disclaimerCheck = true;
						disclaimerDialog = false;
					"
					>我同意</el-button
				>
			</template>
		</el-dialog>
		<img class="acgirl" src="/imgs/common/welcome.png" />
		<div class="foter left">软件版本号：{{ common.version }}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Cookies from "@front/util_function/cookies";
import topbarBase from "@front/components/system/topbars/base.vue";
import { loadConfig, launch } from "@front/util_function/system";
import { assign } from "@front/util_function/base";
import { login, loginSession } from "@front/api/user";
import { getManagerList } from "@front/api/room";
import { isOnline } from "@front/api/utils/websocket";
import { login as loginTexts, common } from "@front/texts";

export default defineComponent({
	name: "login",
	components: {
		topbarBase
	},
	data() {
		const checkTimer: any = null;
		return {
			userData: {
				account: "",
				password: "",
				keepLogined: false,
				disclaimerCheck: false
			},
			common: common(),
			disclaimerDialog: false,
			logining: false,
			serveOnline: false,
			checkTimer,
			loginFailedText: "",
			welcome: false,
			welcomeLogoKey: "111"
		};
	},
	computed: {
		loginTexts,
		loginDisabled(): boolean {
			return (
				!this.userData.account ||
				!this.userData.password ||
				!this.userData.disclaimerCheck ||
				this.logining
			);
		},
		loginText(): string {
			if (this.logining) {
				return "登陆中...";
			}
			if (this.loginFailedText) {
				return `登陆失败： ${this.loginFailedText}`;
			}
			if (this.serveOnline) {
				return "服务端已连接";
			}
			return "服务端离线,请尝试关闭工具箱并右键以管理员权限打开";
		}
	},
	mounted() {
		this.getCookie();
		this.autoLogin();
		loadConfig().then((res: any) => {
			if (res) {
				assign(this.$store.state.danmakuProfile, res);
			}
			if (res?.general?.streamToolEnable) {
				launch(res?.general?.streamToolPath);
			}
		});
		this.checkOnline();
	},
	beforeUnmount() {
		clearInterval(this.checkTimer);
	},
	methods: {
		checkOnline() {
			isOnline().then(res => (this.serveOnline = res));
			this.checkTimer = setTimeout(this.checkOnline, 5000);
		},
		autoLogin(): void {
			if (
				this.getCookie() &&
				this.userData.keepLogined &&
				sessionStorage.getItem("firstTime") !== "false"
			) {
				this.login();
			}
		},
		async login() {
			this.logining = true;
			if (!this.validation()) {
				this.logining = false;
				return;
			}
			let tokenInfo: any = this.$store.state.userSession;
			loginSession(tokenInfo);
			try {
				await getManagerList();
			} catch (error) {
				try {
					tokenInfo = await login(this.userData);
				} catch (error) {
					this.logining = false;
					this.welcome = false;
					console.log(error);
					this.loginFailedText = error;
					return;
				}
			}
			this.$store.state.userData = this.userData;
			this.$store.state.userSession = tokenInfo;
			sessionStorage.setItem("logined", "true");
			sessionStorage.setItem("firstTime", "false");
			if (this.userData.keepLogined) {
				this.setCookie(tokenInfo);
			}
			this.$store.dispatch("login");
			this.$router.replace("dashboard");
		},
		getCookie() {
			const userData = Cookies.get("userData");
			const tokenInfo = Cookies.get("tokenInfo");
			if (userData) {
				this.userData = userData;
			}
			if (!tokenInfo?.serviceToken) {
				return false;
			}
			this.$store.state.userSession = tokenInfo;
			return true;
		},
		setCookie(tokenInfo: any) {
			const expiry = 2 * 60 * 60 * 24 * 1000;
			const expiry2 = 60 * 60 * 60 * 24 * 1000;
			Cookies.set("userData", this.userData, expiry2);
			Cookies.set("tokenInfo", tokenInfo, expiry);
		},
		validation() {
			if (
				!this.userData.account ||
				!this.userData.password ||
				!this.userData.disclaimerCheck
			) {
				return false;
			} else {
				return true;
			}
		}
	}
});
</script>

<style lang="scss" scoped>
@import "@front/styles/variables.scss";
#login {
	width: 100%;
	height: 100%;
	font-size: $--font-size-base;
	color: rgba($color: white, $alpha: 0.9);
	background-color: $--color-primary;
	box-shadow: $--box-shadow-dark;
	border-radius: $--border-radius-small;
	.topbar {
		position: absolute;
		top: 0px;
	}
	.welcome {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		user-select: none;
		text-align: center;
		.welcomeLogo {
			width: 200px;
			margin-top: -200px;
			pointer-events: none;
		}
		.welcomeText {
			text-align: center;
			padding: 24px 0px;
			font-size: $--font-size-extra-large;
		}
	}
	.panel {
		position: absolute;
		top: 215px;
		left: 120px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		z-index: 100;
		.hero {
			position: fixed;
			left: 425px;
			top: 121px;
			width: calc(100vw - 645px);
		}
		.form {
			padding: 24px 0px;
			height: 300px;
			width: 300px;
			.row {
				padding: 6px 0px;
				.logBtn {
					width: 300px;
					height: 42px;
					background-color: $--color-primary-light-3;
					&:hover {
						background-color: $--color-primary-light-5;
					}
				}
				&.sep {
					display: flex !important;
					justify-content: space-between;
					align-items: center;
					user-select: none;
				}
			}
			&.logText {
				padding: 16px 0px;
				user-select: none;
				width: 100%;
				word-break: break-all;
			}

			.buttonText {
				color: $--color-primary-light-3 !important;
			}
		}
	}
}
.foter {
	position: absolute;
	bottom: 0px;
	font-size: $--font-size-extra-small;
	color: rgba($color: white, $alpha: 0.5);
	padding: 16px 0px;
	&.left {
		left: 10px;
		text-align: left;
	}
	&.right {
		right: 10px;
		text-align: right;
	}
}
.acgirl {
	position: absolute;
	right: 0px;
	bottom: 60px;
}
</style>
