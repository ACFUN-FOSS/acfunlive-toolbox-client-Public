<template>
	<div class="super-chat-list">
		<div class="super-chat-list-row">
			<list-block :selectedID="temp.superChatID" @click="select(scBlock,5000)" :displayType="displayType" v-for="scBlock in temp.superChatArray" :key="scBlock.uid" :sc-block="scBlock" :currentTime="currentTime" @end="remove(scBlock)" />
		</div>
		<transition name="fade" mode="out-in">
			<list-panel class="super-chat-panel" :displayType="displayType" :key="temp.superChatID" v-if="temp.superChatBlock" :sc-block="temp.superChatBlock" :currentTime="currentTime" @next="next()" />
		</transition>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import listBlock from "./listBlock.vue";
import listPanel from "./listPanel.vue";
import { event } from "@front/util_function/eventBus";
export default defineComponent({
	name: "superChatList",
	components: { listBlock, listPanel },
	data() {
		const timeCounter: any = null;
		return {
			currentTime: 0,
			timeCounter
		};
	},
	mounted() {
		this.count();
		event.on("super-chat-updated", this.update);
	},
	beforeUnmount() {
		clearTimeout(this.timeCounter);
		event.off("super-chat-updated", this.update);
	},
	computed: {
		...mapState(["temp", "danmakuProfile"]),
		superChatArray(): Array<any> {
			return this.temp.superChatArray;
		},
		displayType(): number {
			return this.danmakuProfile.common?.superChat?.displayType || 0;
		}
	},
	methods: {
		update() {
			if (this.temp.superChatID) {
				return;
			}
			this.next();
		},
		count() {
			clearTimeout(this.timeCounter);
			this.currentTime = Date.now();
			this.timeCounter = setTimeout(() => {
				this.count();
			}, 1000);
		},
		next() {
			const nextOne = this.temp.superChatArray.find(
				(block: any) => !block?.showed
			);
			if (
				!nextOne &&
				this.currentTime > this.temp.superChatBlock.listEndTime
			) {
				this.temp.superChatID = 0;
				this.temp.superChatBlock = false;
			} else {
				this.select(nextOne);
			}
		},
		select(block: any, time = 20000) {
			block.showed = true;
			block.panelEndTime = Date.now() + time;
			if (block.listEndTime < block.panelEndTime) {
				block.listEndTime = block.panelEndTime;
			}
			this.temp.superChatID = block.uid;
			this.temp.superChatBlock = block;
		},
		remove(block: any) {
			this.temp.superChatArray = this.temp.superChatArray.filter(
				(blockI: any) => blockI !== block
			);
			if (block.uid === this.temp.superChatID) {
				this.next();
			}
		}
	}
});
</script>

<style scoped lang='scss'>
@import "@front/styles/variables.scss";
.super-chat-list {
	position: relative;
	width: 100%;
	height: 35px;
	box-sizing: border-box;
	border: $--border-base;
	.super-chat-list-row {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		overflow: hidden;
		padding-left: 8px;
	}
}
</style>
