<template>
  <p class="time">{{ hours }}:{{ mins }}:{{ seconds }}</p>
</template>
<script>

export default {
  data: () => ({
    days: '0',
    hours: '00',
    mins: '00',
    seconds: '00',
    timer: null,
    curTime: 0,
    innerTime: 0,
  }),
  props: {
    time: {
      type: [Number, String],
      default: 0
    },
    refreshCounter: {
      type: [Number, String],
      default: 0
    },
    end: {
      type: [Number, String],
      default: 0
    },
    isMiniSecond: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    duration() {
      if (this.end) {
        let end = String(this.end).length >= 13 ? +this.end : +this.end * 1000;
        end -= Date.now();
        return end;
      }
      var time = this.isMiniSecond ? Math.round(+this.time / 1000) : Math.round(+this.time);
      return time;
    }
  },
  mounted() {
    this.countDown();
  },
  watch: {
    duration() {
      this.countDown();
    },
    refreshCounter() {
      this.countDown();
    }
  },
  methods: {
    durationFormatter(time) {
      if (!time) return { ss: 0 };
      let t = time;
      const ss = t % 60;
      t = (t - ss) / 60;
      if (t < 1) return { ss };
      const mm = t % 60;
      t = (t - mm) / 60;
      if (t < 1) return { mm, ss };
      const hh = t % 24;
      t = (t - hh) / 24;
      if (t < 1) return { hh, mm, ss };
      const dd = t;
      return { dd, hh, mm, ss };
    },
    countDown() {
      this.curTime = Date.now();
      this.getTime(this.duration);
    },
    stop() {
      this.timer && clearTimeout(this.timer);
    },
    restart() {
      var h = Number(this.hours) || 0
      var m = Number(this.mins) || 0
      var s = Number(this.seconds) || 0
      var t = (h * 3600 + m * 60 + s)
      this.getTime(t);
    },
    getTime(time) {
      this.timer && clearTimeout(this.timer);
      if (time < 0) {
        return;
      }
      const { dd, hh, mm, ss } = this.durationFormatter(time);
      this.days = dd || 0;
      // this.hours = `00${hh || ''}`.slice(-2);
      // this.mins = `00${mm || ''}`.slice(-2);
      // this.seconds = `00${ss || ''}`.slice(-2);
      this.hours = hh || 0;
      this.mins = mm || 0;
      this.seconds = ss || 0;
      this.timer = setTimeout(() => {
        // const now = Date.now();
        // const diffTime = Math.floor((now - this.curTime) / 1000);
        // const step = diffTime > 1 ? diffTime : 1; // 页面退到后台的时候不会计时，对比时间差，大于1s的重置倒计时
        // this.curTime = now;
        this.getTime(time - 1);
      }, 1000);
    }
  }
};
</script>
<style>
</style>
