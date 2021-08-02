<template>
   <span class="timer">{{formatTime}}</span>
</template>

<script lang="ts">

export default {
  name: 'Countdown',
  props: {
    to: Number,
  },
  computed: {
    // a computed getter
    timeToGo(): number {
      // `this` points to the vm instance
      return this.to - this.$store.state.now;
    },
    formatTime(): string {
      const time = Math.abs(this.timeToGo);
      const minutes = Math.floor(time / 60);
      const seconds = time - minutes * 60;

      return `${minutes ? `${minutes}m` : ''} ${seconds}s${this.timeToGo < 0 ? ' ago' : ''}`;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
