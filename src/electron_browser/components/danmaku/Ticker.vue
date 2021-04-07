<template>
	<yt-live-chat-ticker-renderer :hidden="showMessages.length === 0">
		<div id="container" dir="ltr" class="style-scope yt-live-chat-ticker-renderer">
			<div id="items" class="style-scope yt-live-chat-ticker-renderer">
				<yt-live-chat-ticker-paid-message-item-renderer v-for="message in showMessages" :key="message.raw.uniqueId"
					tabindex="0" class="style-scope yt-live-chat-ticker-renderer" style="overflow: hidden;"
					@click="onItemClick(message.raw)">
					<div id="container" dir="ltr" class="style-scope yt-live-chat-ticker-paid-message-item-renderer" :style="{
            background: message.bgColor,
          }">
						<div id="content" class="style-scope yt-live-chat-ticker-paid-message-item-renderer" :style="{
              color: message.color
            }">
							<img-shadow id="author-photo" height="24" width="24"
								class="style-scope yt-live-chat-ticker-paid-message-item-renderer" :imgUrl="message.raw.avatarUrl">
							</img-shadow>
							<span id="text" dir="ltr"
								class="style-scope yt-live-chat-ticker-paid-message-item-renderer">{{message.text}}</span>
						</div>
					</div>
				</yt-live-chat-ticker-paid-message-item-renderer>
			</div>
		</div>
		<template v-if="pinnedMessage">
			<membership-item :key="pinnedMessage.id" v-if="pinnedMessage.type === MESSAGE_TYPE_MEMBER"
				class="style-scope yt-live-chat-ticker-renderer" :avatarUrl="pinnedMessage.avatarUrl"
				:authorName="pinnedMessage.authorName" :privilegeType="pinnedMessage.privilegeType" :title="pinnedMessage.title"
				:time="pinnedMessage.time"></membership-item>
			<paid-message :key="pinnedMessage.id" v-else class="style-scope yt-live-chat-ticker-renderer"
				:price="pinnedMessage.price" :avatarUrl="pinnedMessage.avatarUrl" :authorName="pinnedMessage.authorName"
				:time="pinnedMessage.time" :content="pinnedMessageShowContent"></paid-message>
		</template>
	</yt-live-chat-ticker-renderer>
</template>

<script>
import * as chatConfig from "./api/chatConfig";
import { formatCurrency } from "./api/utils";
import ImgShadow from "./ImgShadow.vue";
import PaidMessage from "./PaidMessage.vue";
import * as constants from "./api/constants";
import { defineComponent } from "vue";
export default defineComponent({
	name: "Ticker",
	components: {
		ImgShadow,
		PaidMessage
	},
	props: {
		messages: {
			default: () => {
				return [];
			}
		},
		showGiftName: {
			type: Boolean,
			default: chatConfig.DEFAULT_CONFIG.showGiftName
		},
		showGiftPrice: {
			type: Boolean,
			default: chatConfig.DEFAULT_CONFIG.showGiftPrice
		},
		showACCoinInstead: {
			type: Boolean,
			default: chatConfig.DEFAULT_CONFIG.showACCoinInstead
		},
		exchangeRate: {
			// 换算倍率
			type: Number,
			default: chatConfig.DEFAULT_CONFIG.exchangeRate
		}
	},
	data() {
		return {
			MESSAGE_TYPE_MEMBER: constants.MESSAGE_TYPE_MEMBER,

			curTime: new Date(),
			updateTimerId: window.setInterval(this.updateProgress, 1000),
			pinnedMessage: null
		};
	},
	computed: {
		showMessages() {
			const res = [];
			for (const message of this.messages) {
				if (!this.needToShow(message)) {
					continue;
				}
				res.push({
					raw: message,
					bgColor: this.getBgColor(message),
					color: this.getColor(message),
					text: this.getText(message)
				});
			}
			return res;
		},
		pinnedMessageShowContent() {
			if (!this.pinnedMessage) {
				return "";
			}
			if (this.pinnedMessage.type === constants.MESSAGE_TYPE_GIFT) {
				return constants.getGiftShowContent(
					this.pinnedMessage,
					this.showGiftName
				);
			} else {
				return constants.getShowContent(this.pinnedMessage);
			}
		}
	},
	beforeUnmount() {
		window.clearInterval(this.updateTimerId);
	},
	methods: {
		needToShow(message) {
			const pinTime = this.getPinTime(message);
			return (new Date() - message.addTime) / (60 * 1000) < pinTime;
		},
		getBgColor(message) {
			let color1 = "rgba(15,157,88,1)";
			let color2 = "rgba(11,128,67,1)";
			if (message.type === constants.MESSAGE_TYPE_MEMBER) {
				color1 = "rgba(15,157,88,1)";
				color2 = "rgba(11,128,67,1)";
			} else {
				const config = constants.getPriceConfig(
					message.price / this.exchangeRate
				);
				color1 = config.colors.contentBg;
				color2 = config.colors.headerBg;
			}
			const pinTime = this.getPinTime(message);
			let progress =
				(1 - (this.curTime - message.addTime) / (60 * 1000) / pinTime) *
				100;
			if (progress < 0) {
				progress = 0;
			} else if (progress > 100) {
				progress = 100;
			}
			return `linear-gradient(90deg, ${color1}, ${color1} ${progress}%, ${color2} ${progress}%, ${color2})`;
		},
		getColor(message) {
			if (message.type === constants.MESSAGE_TYPE_MEMBER) {
				return "rgb(255,255,255)";
			}
			return constants.getPriceConfig(message.price / this.exchangeRate)
				.colors.header;
		},
		getText(message) {
			if (!this.showGiftPrice) {
				return "";
			}
			if (this.showACCoinInstead) {
				return parseInt(message.price * 10) + "AC币";
			}
			if (message.type === constants.MESSAGE_TYPE_MEMBER) {
				return "Member";
			}
			return "¥" + formatCurrency(message.price);
		},
		getPinTime(message) {
			if (message.type === constants.MESSAGE_TYPE_MEMBER) {
				return 2;
			}
			return constants.getPriceConfig(message.price / this.exchangeRate)
				.pinTime;
		},
		updateProgress() {
			this.curTime = new Date();
			/* eslint-disable */
			for (let i = 0; i < this.messages.length; ) {
				const message = this.messages[i];
				const pinTime = this.getPinTime(message);
				if ((this.curTime - message.addTime) / (60 * 1000) >= pinTime) {
					if (this.pinnedMessage === message) {
						this.pinnedMessage = null;
					}
					/* eslint-disable */
					this.messages.splice(i, 1);
					/* eslint-disable */
				} else {
					i++;
				}
			}
		},
		onItemClick(message) {
			if (this.pinnedMessage === message) {
				this.pinnedMessage = null;
			} else {
				this.pinnedMessage = message;
			}
		}
	}
});
</script>

<style src="./style/yt-live-chat-ticker-renderer.css"></style>
<style src="./style/yt-live-chat-ticker-paid-message-item-renderer.css"></style>
