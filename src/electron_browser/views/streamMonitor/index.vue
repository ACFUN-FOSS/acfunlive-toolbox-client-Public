<template>
	<title-frame id="streamMonitor" title="监控面板">
		<content-frame align="column">
			<row-frame style="height:100%">
				<row-frame width="100%" title="房间信息">
					<row-span>
						<room-info />
					</row-span>
				</row-frame>
				<shotcut />
				<row-frame title="小程序">
					<applet-list style="width:330px;height:265px" />
				</row-frame>
			</row-frame>
			<row-frame class="danmakuPanel" style="height:100%">
				<row-frame width="100%" title="">
					<row-span style="z-index:10000">
						<room-list />
					</row-span>
				</row-frame>
				<row-frame :class="{superChatEnable}" width="100%" title="弹幕流" :flex="true"
					:content-default-class="false">
					<row-span :span="12" style="padding:0px">
						<div class="list-add-btn" style="top:0px">
							<div class="slider">背景亮度：
								<el-slider style="width:100px" v-model="brightness" :min="20" :max="100" :step="1" />
							</div>
						</div>
						<super-chat-list v-if="superChatEnable"
							:class="{'empty':!temp||temp.superChatArray.length===0}" />
						<div class="danmaku-list-bg" :style="{'--brightness':(100- brightness)/100}">
							<danmaku-flow style="font-size:18px!important" :danmakuList="danmakuList"
								:settings="settings" />
						</div>
					</row-span>
				</row-frame>
				<row-frame width="100%">
					<row-span :span="12" style="padding:0px">
						<room-chat />
					</row-span>
				</row-frame>
			</row-frame>

		</content-frame>
	</title-frame>
	<minify v-if="minify" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapState } from "vuex";
import roomInfo from "./roomInfo.vue";
import danmakuFlow from "@front/components/danmakuFlow/index.vue";
import superChatList from "@front/components/superChat/index.vue";
import shotcut from "./shotcut.vue";
import roomList from "@front/components/roomList/roomList.vue";
import roomChat from "@front/components/roomChat/index.vue";
import minify from "@front/components/minify/index.vue";
import appletList from "@front/views/applets/widget.vue";
export default defineComponent({
	name: "streamMonitor",
	components: {
		roomInfo,
		danmakuFlow,
		shotcut,
		roomList,
		roomChat,
		minify,
		superChatList,
		appletList
	},
	data() {
		return {
			brightness: 50
		};
	},
	computed: {
		...mapGetters(["danmakuProfile", "danmakuList", "superChatEnable"]),
		...mapState(["minify", "temp"]),
		settings() {
			// @ts-ignore
			return this.danmakuProfile("toolBox");
		}
	},
	watch: {},
	methods: {}
});
</script>
<style scoped lang='scss'>
@import "@front/styles/variables.scss";
#streamMonitor {
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 100;
	.superChatEnable {
		.danmaku-list-bg > div {
			height: 315px;
		}
	}
}
.empty::after {
	position: absolute;
	width: 100%;
	height: 35px;
	content: "超级聊已开启，当前未有人投喂~";
	left: 0px;
	top: 0px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: $--color-text-regular;
}
.danmaku-list-bg {
	width: 100%;
	position: relative;

	overflow: hidden;
	& > div {
		height: 350px;
	}
	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: black;
		opacity: var(--brightness);
	}
}
.list-add-btn {
	position: absolute;
	right: 0px;
	display: flex;
	.slider {
		display: flex;
		align-items: center;
		margin-top: -35px;
		margin-right: 20px;
	}
}
</style>
