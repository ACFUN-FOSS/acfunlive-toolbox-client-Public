var Countdown = {
  days: '0',
  hours: '00',
  mins: '00',
  seconds: '00',
  timer: null,
  duration() {
    if (this.end) {
      let end = String(this.end).length >= 13 ? +this.end : +this.end * 1000;
      end -= Date.now();
      return end;
    }
    const time = this.isMiniSecond ? Math.round(+this.time / 1000) : Math.round(+this.time);
    return time;
  },
  countDown(callback) {
    this.getTime(this.duration(), callback);
  },
  getTime(duration, callback) {
    this.timer && clearTimeout(this.timer);
    if (duration < 0) {
      return;
    }
    const { dd, hh, mm, ss } = this.durationFormatter(duration);
    this.days = dd || 0;
    this.hours = hh || 0;
    this.mins = mm || 0;
    this.seconds = ss || 0;
    this.timer = setTimeout(() => {
      this.getTime(duration - 1);
      typeof callback == 'function' && callback();
    }, 1000);
  },
  stop(func) {
    clearTimeout(this.timer);
    typeof func == 'function' && func();
  },
  reset(func) {
    typeof func == 'function' && func();
  },
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
}

moudle.exports = Countdown
