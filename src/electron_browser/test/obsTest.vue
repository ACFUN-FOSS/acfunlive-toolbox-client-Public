<template>
	<div class="danmaku">
		<button @click="sendMessage" :disabled="disable">发个消息</button>
	</div>
</template>

<script>
import { defineComponent } from "vue";

import OBSWebSocket, { EventSubscription } from "obs-websocket-js";
export default defineComponent({
	cname: "obs测试",
	name: "obsTest",
	data() {
		return {
			disable: true
		};
	},
	mounted() {
		this.socket = new OBSWebSocket();
		this.socket
			.connect("ws://127.0.0.1:4455", undefined, {
				rpcVersion: 1,
				eventSubscription: 1023
			})
			.then(res => {
				console.log(res);
				this.disable = false;
			});
	},
	beforeUnmount() {
		this.socket?.disconnect();
	},
	methods: {
		async sendMessage() {
			try {
				const res = await this.socket.call("SetStreamServiceSettings", {
					streamServiceType: "rtmp_custom",
					streamServiceSettings: {
						bwtest: false,
						key:
							"kszt_oH5TrPqvwMk?sign=c641817b-d0da45db17dc85af3f348d3f41493ee6&ks_fix_ts&ks_ctx=dHRwOlBVTEw7dGZiOjE7cGR0OktVQUlTSE9VO3Zlcjo3ODg7cGR5OjA7dnF0OlVOS05PV047aXNWOmZhbHNlO2FpZDoyMTQ4NDQ7Y2lkOlRISVJEX1VQREFURV9UU0M%3D",
						server: "rtmp://txyun-push.voip.yximgs.com/livecloud",
						use_auth: false
					}
				});
				console.log(res);
				const open = await this.socket.call("StartStream");
			} catch (error) {
				console.log(error);
			}
		}
	}
});
</script>
<style scoped lang="scss">
.danmaku {
	width: 400px;
	padding: 5px;
	background-color: greenyellow;

	& > div {
		display: inline;
	}
}
</style>
