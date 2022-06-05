<template>
	<div class="switch-menu">
		<div class="icon iconfont icon-calc" @click="activeSlide = 0" :class="{ active: activeSlide == 0 }"></div>
		<div class="icon iconfont icon-clock" @click="activeSlide = 1" :class="{ active: activeSlide == 1 }"></div>
		<div class="icon iconfont icon-countdown" @click="activeSlide = 2" :class="{ active: activeSlide == 2 }"></div>
		<div class="icon iconfont icon-randomnum" @click="activeSlide = 3" :class="{ active: activeSlide == 3 }"></div>
	</div>
	<div class="calculator slide" :class="{ show: activeSlide == 0 }">
		<div class="calc-display">
			<div class="result" ref="r1"><span ref="s1" :style="{ 'font-size': fontSize }">{{ result }}</span></div>
			<div class="arithmetics " ref="r2"><span ref="s2">{{ calcStr }}</span></div>
		</div>
		<div class="calculator-keypad">
			<div class="calculator-keypad-wrapper">
				<div class="calculator-keypad-row sp">
					<div class="calculator-keypad-key" @click="handleCalcStr('C')">
						<span>C</span>
					</div>
					<div class="calculator-keypad-key" @click="handleCalcStr('←')">
						<span>←</span>
					</div>
					<div class="calculator-keypad-key" @click="handleCalcStr('%')">
						<span>%</span>
					</div>
					<div class="calculator-keypad-key divide" @click="handleCalcStr('/')">
						<span class="divide"></span>
					</div>
				</div>
				<div class="calculator-keypad-row">
					<div class="calculator-keypad-key" @click="handleCalcStr('7')">
						<span>7</span>
					</div>
					<div class="calculator-keypad-key" @click="handleCalcStr('8')">
						<span>8</span>
					</div>
					<div class="calculator-keypad-key" @click="handleCalcStr('9')">
						<span>9</span>
					</div>
					<div class="calculator-keypad-key" @click="handleCalcStr('*')">
						<span class="multi">*</span>
					</div>
				</div>
				<div class="calculator-keypad-row">
					<div class="calculator-keypad-key" @click="handleCalcStr('4')">
						<span>4</span>
					</div>
					<div class="calculator-keypad-key" @click="handleCalcStr('5')">
						<span>5</span>
					</div>
					<div class="calculator-keypad-key" @click="handleCalcStr('6')">
						<span>6</span>
					</div>
					<div class="calculator-keypad-key" @click="handleCalcStr('-')">
						<span>-</span>
					</div>
				</div>
				<div class="calculator-keypad-row">
					<div class="calculator-keypad-key" @click="handleCalcStr('1')">
						<span>1</span>
					</div>
					<div class="calculator-keypad-key" @click="handleCalcStr('2')">
						<span>2</span>
					</div>
					<div class="calculator-keypad-key" @click="handleCalcStr('3')">
						<span>3</span>
					</div>
					<div class="calculator-keypad-key" @click="handleCalcStr('+')">
						<span>+</span>
					</div>
				</div>
				<div class="calculator-keypad-row">
					<div class="calculator-keypad-key zero" @click="handleCalcStr('0')">
						<span>0</span>
					</div>
					<div class="calculator-keypad-key comma" @click="handleCalcStr('.')">
						<span>.</span>
					</div>
					<div class="calculator-keypad-key equal" @click="handleCalcStr('=')">
						<span>=</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="countup slide" :class="{ show: activeSlide == 1 }">
		<count-up ref="countup"></count-up>
		<div class="bar">
			<div class="btn btn-start" @click="countUpStart">开始</div>
			<div class="btn btn-stop" @click="countUpStop">暂停</div>
			<div class="btn btn-reset" @click="countUpReset">重置</div>
		</div>
	</div>
	<div class="countdown slide" :class="{ show: activeSlide == 2 }">
		<count-down :time="countdowntime" :timer="countdownTimer" ref="timeref">
		</count-down>
		<div class="timepicker">
			<div class="tip">选择时间:</div>
			<input class="selectTime" id="appt-time" type="time" name="appt-time" step="2" v-model="time"
				@change="countflag = true">
			<div class="btn btn-start" @click="countDownStart">开始</div>
			<div class="btn btn-stop" @click="countDownStop">暂停</div>
			<div class="btn btn-reset" @click="countDownReset">重置</div>
		</div>
	</div>
	<div class="randomnum slide" :class="{ show: activeSlide == 3 }">
		<random-num></random-num>
	</div>
</template>

<script>
const Calculator = require('/applets/toolCollection/lib/calculator.js');
import CountDown from '/applets/toolCollection/components/countdown.vue'
import CountUp from '/applets/toolCollection/components/countup.vue'
import RandomNum from '/applets/toolCollection/components/randomnum.vue'

export default {
	name: "toolCollection",
	data() {
		return {
			calc: new Calculator(),
			result: "",
			fontSize: "113px",
			calcStr: "",
			activeSlide: 3,
			//倒计时相关
			time: null,
			countdowntime: null,
			countdownTimer: null,
			countflag: false
		};
	},
	components: {
		CountDown,
		CountUp,
		RandomNum
	},
	mounted() {
		const resizeObserver = new ResizeObserver(entrie => {
			this.autoFontSize()
		});

		resizeObserver.observe(this.$refs.s1);
	},
	methods: {
		autoFontSize() {
			var w1 = this.$refs.s1.offsetWidth
			var w2 = this.$refs.r1.offsetWidth
			this.$nextTick(() => {
				if (w1 > w2) {
					var s1_size = window.getComputedStyle(this.$refs.s1).getPropertyValue('font-size')
					var size = Math.floor(w2 * parseInt(s1_size) / w1)
					this.$nextTick(() => {
						this.fontSize = size + 'px'
					})
				} else {
					this.$nextTick(() => {
						setTimeout(() => {
							this.fontSize = '113px'
						}, 100);
					})
				}
			})
		},
		handleCalcStr(s) {
			switch (s) {
				case 'C':
					this.calcStr = ""
					this.result = ""
					break
				case '←':
					this.calcStr && (this.calcStr = this.calcStr.substring(0, this.calcStr.length - 1))
					break
				case '%':
					this.calcStr += '%'
					break
				case '+':
					this.calcStr += '+'
					break
				case '-':
					this.calcStr += '-'
					break
				case '*':
					this.calcStr += '*'
					break
				case '/':
					this.calcStr += '/'
					break
				case '.':
					this.calcStr += '.'
					break
				case '=':
					this.calcResult()
					break
				case '0':
					this.calcStr += '0'
					break
				case '1':
					this.calcStr += '1'
					break
				case '2':
					this.calcStr += '2'
					break
				case '3':
					this.calcStr += '3'
					break
				case '4':
					this.calcStr += '4'
					break
				case '5':
					this.calcStr += '5'
					break
				case '6':
					this.calcStr += '6'
					break
				case '7':
					this.calcStr += '7'
					break
				case '8':
					this.calcStr += '8'
					break
				case '9':
					this.calcStr += '9'
					break
			}
		},
		calcResult() {
			this.result = String(this.calc.parse(this.calcStr).value)
			this.calcStr = this.result
		},
		countDownStart() {
			if (this.countflag) {
				if (!this.time) return

				var o = this.time.split(":")
				var h = Number(o[0]) || 0
				var m = Number(o[1]) || 0
				var s = Number(o[2]) || 0
				console.log('this.time', this.time, h, m, s)
				this.countdowntime = (h * 3600 + m * 60 + s)
				console.log(this.countdowntime)
				this.$refs.timeref.countDown()
			} else {
				if (this.countdowntime) {
					this.$refs.timeref.restart()
				}
			}
		},
		countDownStop() {
			this.countflag = false
			this.$refs.timeref.stop()
		},
		countDownReset() {
			this.countflag = true
			this.countdowntime = 0
			this.$refs.timeref.stop()
		},
		countUpStart() {
			this.$refs.countup.start()
		},
		countUpStop() {
			this.$refs.countup.stop()
		},
		countUpReset() {
			this.$refs.countup.reset()
		},
	},
};
</script>

<style>
@import url(/applets/toolCollection/css/menu.css);
@import url(/applets/toolCollection/css/calculator.css);
@import url(/applets/toolCollection/css/countdown.css);
@import url(/applets/toolCollection/css/countup.css);
@import url(/applets/toolCollection/css/random.css);
</style>
