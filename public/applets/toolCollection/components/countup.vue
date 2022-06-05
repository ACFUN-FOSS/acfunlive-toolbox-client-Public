<template>
  <p class="time">{{ mins }}:{{ seconds }}:{{ millseconds }}</p>
</template>
<script>

export default {
  data: () => ({
    hours: '00',
    mins: '00',
    seconds: '00',
    millseconds:'00',
    timer: null,
    duration:0,
  }),
  methods: {
    start() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.duration += 0.01;
        this.updateTime();
      }, 10);
    },
    reset(){
      this.stop()
      this.duration = 0;
      this.updateTime();
      
    },
    updateTime(){
      let time = this.duration;
      let hours = Math.floor(time / 3600);
      let mins = Math.floor((time % 3600) / 60);
      let seconds = Math.floor(time % 60);
      let millseconds = Math.floor((time % 1) * 1000);
      this.hours = hours < 10 ? '0' + hours : hours;
      this.mins = mins < 10 ? '0' + mins : mins;
      this.seconds = seconds < 10 ? '0' + seconds : seconds;
      this.millseconds = millseconds < 100 ? '0' + millseconds : millseconds;
    },
    stop(){
      clearInterval(this.timer);
    },
  }
}
