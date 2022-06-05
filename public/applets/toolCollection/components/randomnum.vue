<template>
  <div class="random">
    <div class="center">{{randomnum}}</div>
    <div class="line">
      <input type="number" v-model="num1">
      <input type="number" v-model="num2">
    </div>
    <div class="btn" @click="gen">生成</div>
  </div>
</template>

<script>
export default {
  name: 'randomnum',
  data() {
    return {
      randomnum: 0,
      num1:0,
      num2:100,
    };
  },
  methods:{
    gen(){
      this.randomnum = Math.floor(Math.random() * (this.num2 - this.num1 + 1) + this.num1);
    }
  }
}
