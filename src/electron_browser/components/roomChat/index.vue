<template>
	<div id="room-chat" style="width:100%">
		<el-input ref="input" size="mini" @keyup.enter="sendDanmaku" v-model="value" :placeholder="status.tips" :disabled="status.disabled">
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
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";
import { ElMessage } from "element-plus";
import { chat } from "@front/api/chat";
import { event } from "@front/util_function/eventBus";
export default defineComponent({
	name: "roomChat",
	data() {
		return {
			value: "",
			cooling: false
		};
	},
	mounted() {
		event.on("message-focus", this.focus);
	},
	beforeUnmount() {
		event.off("message-focus", this.focus);
	},
	computed: {
		...mapGetters(["isStreaming", "isLogined"]),
		...mapState(["userSession", "roomProfile", "danmakuProfile"]),
		status(): any {
			if (this.cooling) {
				return {
					disabled: true,
					tips: "冷却中，等一下啦"
				};
			}
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
		sendDanmaku() {
			if (!this.validation()) {
				return;
			}
			const msg = this.value;
			this.cooling = true;
			chat({
				userID: this.userSession.userID,
				deviceID: this.userSession.deviceID,
				serviceToken: this.userSession.serviceToken,
				data: {
					visitorId: this.userSession.userID,
					liveId: this.roomProfile.liveID,
					content: msg
				}
			});
			event.emit("send-message");
			ElMessage({
				message: "发送成功",
				duration: 1500,
				type: "success",
				offset: 60
			});
			this.value = "";
			setTimeout(() => {
				this.cooling = false;
				// @ts-ignore
				this.$refs.input.focus();
			}, 500);
		},
		focus() {
			// @ts-ignore
			this.$refs.input.focus();
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
@import "@front/styles/variables.scss";
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
