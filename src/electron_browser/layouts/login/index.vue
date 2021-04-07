<template>
	<div id="login">
		<topbar-base class="topbar" />
		<transition name="fade_transform" mode="out-in">
			<div class="panel" v-if="!welcome">
				<hero-base />
				<div class="form">
					<div class="row">
						<el-input v-model="userData.account" :disabled="logining" placeholder="A站用户名" />
					</div>
					<div class="row">
						<el-input type="password" v-model="userData.password" :disabled="logining" placeholder="A站密码" />
					</div>
					<div class="row sep">
						<div>
							<el-checkbox class="logCheck" v-model="userData.disclaimerCheck" :disabled="logining" />
							同意 ><el-button type="text" class="buttonText" @click="disclaimerDialog = true" :disabled="logining">免责声明
							</el-button>
						</div>
						<div>
							<el-checkbox class="logCheck" v-model="userData.keepLogined" :disabled="logining" />
							保持登录
						</div>
					</div>
					<div class="row">
						<el-button :disabled="loginDisabled" class="logBtn" @click="login">登陆</el-button>
					</div>
					<div class="row logText">
						<transition name="fade" mode="out-in">
							<div :key="loginText">{{ loginText }}</div>
						</transition>
					</div>
				</div>
			</div>
			<div class="welcome" v-else>
				<img class="welcomeLogo" :src="`${generalConfig.welcomeLogo}?a=${welcomeLogoKey}`" />
				<div class="welcomeText">{{ generalConfig.welcomeText }}</div>
			</div>
		</transition>
		<footer-base class="foter" />
		<el-dialog custom-class="dialogBase" title="免责声明" v-model="disclaimerDialog">
			<div>{{ generalConfig.disclaimer }}</div>
			<template #footer>
				<el-button size="mini" class="normalBtn" @click="
						userData.disclaimerCheck = true;
						disclaimerDialog = false;
					">我同意</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { config } from "@fe/mixins/mixin";
import Cookies from "@fe/utils/cookies";
import topbarBase from "@fe/components/system/topbars/base.vue";
import { SysMethods } from "@fe/api/sysMethods";
export default defineComponent({
	name: "login",
	mixins: [config],
	components: {
		topbarBase
	},
	data() {
		return {
			userData: {
				account: "",
				password: "",
				keepLogined: false,
				disclaimerCheck: false
			},
			disclaimerDialog: false,
			logining: false,
			loginFailedText: "",
			welcome: false,
			welcomeLogoKey: "111",
			sy: new SysMethods()
		};
	},
	computed: {
		api(): any {
			return this.$store.state.api;
		},
		loginDisabled(): boolean {
			return (
				!this.userData.account ||
				!this.userData.password ||
				!this.userData.disclaimerCheck ||
				this.logining ||
				!this.$store.state.serverOnline
			);
		},
		loginText(): string {
			if (this.logining) {
				return "登陆中...";
			}
			if (this.loginFailedText) {
				return `登陆失败： ${this.loginFailedText}`;
			}
			if (this.$store.state.serverOnline) {
				return "服务端已连接";
			}
			return "服务端离线";
		}
	},
	mounted() {
		if (!this.$store.state.serverOnline) {
			this.$store.dispatch("startServe").then((res: boolean) => {
				if (res) {
					this.autoLogin();
				}
			});
		} else {
			this.autoLogin();
		}
	},
	methods: {
		autoLogin(): void {
			if (this.getCookie() && Cookies.get("firstTime") !== "false") {
				this.login();
			}
		},
		async login(): Promise<void> {
			this.logining = true;
			try {
				const res = await this.api.login(this.userData);
				Object.assign(this.$store.state.userSession, {
					...res.tokenInfo
					// userID: 4537972 // 此处更改为测试直播间id
				});
				Cookies.set("logined", "true");
				Cookies.set("firstTime", "false");

				if (this.userData.keepLogined) {
					this.setCookie();
				}
				this.welcomeLogoKey = String(Math.random());
				this.welcome = true;
				setTimeout(() => {
					this.$router.replace("dashboard");
					this.welcome = false;
					this.logining = false;
				}, 4000);
			} catch (error) {
				console.log(error);
				this.logining = false;
				this.welcome = false;
				this.loginFailedText = "登陆超时，请等待3秒重试";
				this.sy.backendRestart();
			}
		},
		getCookie() {
			const userData = Cookies.get("userData");
			if (!userData) {
				return false;
			}
			this.userData = JSON.parse(userData);
			return true;
		},
		setCookie() {
			Cookies.set("userData", JSON.stringify(this.userData));
		}
	}
});
</script>

<style lang="scss" scoped>
@import "@fe/assets/scss/base";
#login {
	width: 100%;
	height: 100%;
	font-size: var(--generalStyle_fontSize_B);
	color: rgba($color: white, $alpha: 0.9);
	@include dialogBase;
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
			font-size: var(--generalStyle_fontSize_EL);
		}
	}
	.panel {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		.form {
			padding: 24px 0px;
			height: 300px;
			width: 300px;
			.row {
				padding: 6px 0px;
				.logBtn {
					@include buttonBase(
						var(--generalStyle_color_primary_L),
						var(--generalStyle_color_primary_EL),
						white
					);
					width: 300px;
					height: 42px;
				}
				.logCheck {
					@include checkboxBase(var(--generalStyle_color_primary_EL));
				}
				&.logText {
					padding: 16px 0px;
					user-select: none;
					width: 100%;
					word-break: break-all;
				}
				.buttonText {
					@include buttonText(
						rgba($color: white, $alpha: 0.9),
						white
					);
				}
				&.sep {
					display: flex;
					justify-content: space-between;
					align-items: center;
					user-select: none;
				}
			}
		}
	}
	.foter {
		position: absolute;
		bottom: 0px;
		text-align: center;
		width: 100%;
		font-size: var(--generalStyle_fontSize_ES);
		color: rgba($color: white, $alpha: 0.5);
		padding: 16px 0px;
	}
	.normalBtn {
		@include buttonBase(
			var(--generalStyle_color_primary),
			var(--generalStyle_color_primary_L),
			white
		);
	}
}
</style>
