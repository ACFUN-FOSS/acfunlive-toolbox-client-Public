<template>
	<el-input class="room-chat" ref="input" size="mini" @keyup.enter="sendDanmaku" v-model="value" :placeholder="status.tips" :disabled="status.disabled">
		<template #append v-if="danmakuProfile.common.emotion&&danmakuProfile.common.emojis.length">
			<el-dropdown @command="addEmotion" type="primary" trigger="hover" max-height="200px" style="line-height:28px" :hide-on-click="false">
				<el-button type="primary" size="mini" class="btnBase attach">😀</el-button>
				<template #dropdown>
					<el-dropdown-menu class="emotion-drop-down">
						<el-dropdown-item v-for="(emoji,index) in danmakuProfile.common.emojis" :key="index" :command="emoji.pattern">
							<img style="max-width:64px" :src="emoji.url" />
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</template>
	</el-input>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";
import { ElMessage } from "element-plus";
import { sendChat } from "@front/util_function/system";
export default defineComponent({
	name: "roomChat",
	data() {
		return {
			value: ""
		};
	},
	computed: {
		...mapGetters(["isStreaming", "isLogined"]),
		...mapState(["userSession", "roomProfile", "danmakuProfile"]),
		status(): any {
			if (!this.isLogined || !this.isStreaming) {
				return {
					disabled: true,
					tips: !this.isLogined
						? "用户未登录，不可发言"
						: "直播未开启，不可发言"
				};
			}
			return {
				disabled: false,
				tips: "发个弹幕，嘿嘿(enter发送)"
			};
		}
	},
	watch: {
		status: {
			handler(n) {
				if (n.disabled) {
					this.value = "";
				}
			},
			immediate: true
		}
	},
	methods: {
		async sendDanmaku() {
			if (!this.validation()) {
				return;
			}
			const msg = this.value;
			try {
				await sendChat({
					userID: this.userSession.userID,
					deviceID: this.userSession.deviceID,
					serviceToken: this.userSession.serviceToken,
					data: {
						visitorId: this.userSession.userID,
						liveId: this.roomProfile.liveID,
						content: msg
					}
				});
				ElMessage({
					message: "发送成功",
					duration: 1500,
					type: "success",
					offset: 60
				});
				this.value = "";
			} catch (error) {
				console.log(error);
				ElMessage({
					message: "发送失败",
					duration: 1500,
					type: "error",
					offset: 60
				});
			}
		},
		addEmotion(command: string) {
			this.value += command;
			// @ts-ignore
			this.$refs.input.focus();
		},
		validation() {
			let errmsg = "";
			if (!this.value) {
				errmsg = "没有要发送的内容";
			} else if (this.value.length > 50) {
				errmsg = "字数不能大于50字";
			}
			if (errmsg) {
				ElMessage({
					message: "错误: " + errmsg,
					duration: 1500,
					type: "error",
					offset: 60
				});
				return false;
			}
			return true;
		}
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/index.scss";
:deep .el-input-group__append {
	border: none;
}
.btnBase {
	background-color: $--color-primary !important;
	color: white !important;
	border: none !important;
	&.attach {
		border-top-left-radius: 0px !important;
		border-bottom-left-radius: 0px !important;
		padding-left: 8px;
		padding-right: 8px;
		box-shadow: none !important;
	}
}
.emotion-drop-down {
	width: 200px;
	max-width: 90vw;
	display: flex;
	flex-wrap: wrap;
	&:deep .el-dropdown-menu__item {
		padding: 0px;
		width: 25%;
		display: block;
		line-height: 0px;
		& > img {
			width: calc(100% - 16px);
			box-sizing: border-box;
			margin: 8px;
		}
	}
}
</style>
