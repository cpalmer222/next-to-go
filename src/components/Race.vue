<template>
  <article class="race">
    <span class="race-number">R{{ race.race_number }}</span>
    <h1>{{ race.meeting_name }}</h1>
    <Countdown :to="race.advertised_start?.seconds" />
  </article>
</template>

<script>
import Countdown from './Countdown.vue';

export default {
  name: 'Race',
  props: {
    race: Object,
  },
  components: {
    Countdown,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
article {
  display: flex;
  justify-content: space-between;
  padding: 6px;

  h1 {
    margin: 0;
    text-align: left;
    flex-grow: 1;
  }

  .race-number {
    width: 28px;
    height: 28px;
    border: 1px solid #d5d5d5;
    line-height: 31px;
    text-align: center;
    border-radius: 50%;
    display: block;
    margin: 0 8px 0 0;
    font-size: 10px;
  }
}
</style>
