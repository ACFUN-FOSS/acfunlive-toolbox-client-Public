<template>
	<div class="danmaku">
		<button @click="sendMessage">发个消息</button>
	</div>
</template>

<script>
import { defineComponent } from "vue";
import io from "socket.io/client-dist/socket.io";
export default defineComponent({
	cname: "socket测试",
	name: "alignTest",
	data() {
		return {
			socket: null
		};
	},
	mounted() {
		const socket = io("http://localhost:4396", {
			query: {
				"my-key": "my-value"
			}
		});
		this.socket = socket;
		socket.on("connect_error", (err) => {
			console.log("connect error", err);
		});
		socket.emit("chat message", 123);
		console.log(socket);
	},
	methods: {
		sendMessage() {
			if (this.socket) {
				this.socket.emit("chat message", "测试一下");
			}
		}
	}
});
</script>
<style scoped lang='scss'>
.danmaku {
	width: 400px;
	padding: 5px;
	background-color: greenyellow;

	& > div {
		display: inline;
	}
}
</style>
