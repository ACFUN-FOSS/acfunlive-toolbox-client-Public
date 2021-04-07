<template>
	<yt-live-chat-paid-message-renderer class="style-scope yt-live-chat-item-list-renderer" allow-animations
		:show-only-header="!content" :style="{
      '--yt-live-chat-paid-message-primary-color': color.contentBg,
      '--yt-live-chat-paid-message-secondary-color': color.headerBg,
      '--yt-live-chat-paid-message-header-color': color.header,
      '--yt-live-chat-paid-message-author-name-color': color.authorName,
      '--yt-live-chat-paid-message-timestamp-color': color.time,
      '--yt-live-chat-paid-message-color': color.content
    }">
		<div id="card" class="style-scope yt-live-chat-paid-message-renderer">
			<div id="header" class="style-scope yt-live-chat-paid-message-renderer">
				<img-shadow id="author-photo" height="40" width="40" class="style-scope yt-live-chat-paid-message-renderer"
					:imgUrl="getUrl"></img-shadow>
				<div id="header-content" class="style-scope yt-live-chat-paid-message-renderer">
					<div id="header-content-primary-column" class="style-scope yt-live-chat-paid-message-renderer">
						<div id="author-name" class="style-scope yt-live-chat-paid-message-renderer">{{authorName}}</div>
						<div v-if="showGiftPrice" id="purchase-amount" class="style-scope yt-live-chat-paid-message-renderer">
							{{priceText}}</div>
					</div>
					<span id="timestamp" class="style-scope yt-live-chat-paid-message-renderer">{{timeText}}</span>
				</div>
			</div>
			<div id="content" class="style-scope yt-live-chat-paid-message-renderer">
				<div id="message" dir="auto" class="style-scope yt-live-chat-paid-message-renderer">{{
          content
        }}</div>
			</div>
		</div>
	</yt-live-chat-paid-message-renderer>
</template>

<script>
import * as chatConfig from "./api/chatConfig";
import ImgShadow from "./ImgShadow.vue";
import * as constants from "./api/constants";
import * as utils from "./api/utils";
import { defineComponent } from "vue";
export default defineComponent({
	name: "PaidMessage",
	components: {
		ImgShadow
	},
	props: {
		avatarUrl: String,
		webpPicUrl: String,
		authorName: String,
		price: Number, // 价格，人民币
		time: Date,
		content: String,
		showGiftPrice: {
			type: Boolean,
			default: chatConfig.DEFAULT_CONFIG.showGiftPrice
		},
		showACCoinInstead: {
			type: Boolean,
			default: chatConfig.DEFAULT_CONFIG.showACCoinInstead
		},
		showGiftPngInstead: {
			type: Boolean,
			default: chatConfig.DEFAULT_CONFIG.showGiftPngInstead
		},
		exchangeRate: {
			// 换算倍率
			type: Number,
			default: chatConfig.DEFAULT_CONFIG.exchangeRate
		}
	},
	computed: {
		getUrl() {
			if (this.showGiftPngInstead) {
				return this.webpPicUrl;
			}
			return this.avatarUrl;
		},
		color() {
			return constants.getPriceConfig(this.price / this.exchangeRate)
				.colors;
		},
		priceText() {
			if (this.showACCoinInstead) {
				return parseInt(this.price * 10) + "AC币";
			}
			return "¥" + utils.formatCurrency(this.price);
		},
		timeText() {
			return utils.getTimeTextHourMin(this.time);
		}
	}
});
</script>

<style src="./style/yt-live-chat-paid-message-renderer.css"></style>
