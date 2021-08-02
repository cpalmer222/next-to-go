<template>
  <section class="next-to-go">
    <div class="header">
      <h1 class="heading">Next to go</h1>
      <div class="buttons">
        <button
          v-on:click="filter = null"
          v-bind:class="{ active: filter === null }">
        All
        </button>
        <button
          v-for="category in categories"
          v-bind:key="category.ID"
          v-on:click="filter = category.ID"
          v-bind:class="{ active: filter === category.ID }">
          {{ category.name}} racing
        </button>
      </div>  
    </div>
    <Race v-for="race in viewRaces" v-bind:key="race.race_id" :race="race" />
  </section>
</template>

<script lang="ts">
import axios from 'axios';
import Race from './Race.vue';

type RaceObject = {
    race_id: number;
    meeting_name: string;
    category_id: string
}

type NextToGo = {
  races: Array<RaceObject>
  timerInterval: string | null
  filter: string | null
}

type Category = {
  ID: string
  name: string
}

type ApiResponse = {
  next_to_go_ids: Array<string>
  race_summaries: string
}

const CATEGORIES = {
  Greyhound: '9daef0d7-bf3c-4f50-921d-8e818c60fe61',
  Harness: '161d9be2-e909-4326-8c2c-35ed71fb460b',
  Horse: '4a2788f8-e825-4d36-9894-efd4baf1cfae',
};

export default {
  name: 'NextToGo',
  props: {
    message: String,
  },
  data(): NextToGo {
    return {
      races: [],
      timerInterval: null,
      filter: null,
    };
  },
  computed: {
    viewRaces(): Array<RaceObject> {
      let races = [];
      if (this.filter) {
        races = this.races.filter(({ category_id}) => category_id === this.filter);
      } else {
        races = this.races;
      }
      return races.slice(0, 5);
    },
    categories(): Array<Category> {
      return Object.entries(CATEGORIES).map(([name, ID]) => ({ name, ID }));
    },
  },
  methods: {
    fetchApi() : void {
      axios
        .get('https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=50')
        .then((response) => {
          this.processRawFeed(response.data.data);
          return response;
        });
    },
    processRawFeed(data: ApiResponse): void {
      // Find the summaries of each of the next to go races.

      const races = data.next_to_go_ids.map((raceID) => data.race_summaries[raceID]);
      // If not already in the array, add it.
      races.forEach((race) => {
        //Check the race hasn't already been fetched
        const existingRace = this.races.find(({ race_id }) => race_id === race.race_id);

        if (!existingRace && race.advertised_start?.seconds > this.$store.state.now) {
          //Add the race if it is new.
          this.races.push(race);
        }
      });
    },
    pruneExpired(): void {
      this.races.forEach(({ advertised_start }, index) => {
        // Remove race if older than 60seconds
        if (this.$store.state.now - advertised_start.seconds >= 60) {
          this.races.splice(index, 1);
        }
      });
    },
  },
  mounted(): void {
    this.fetchApi();
    this.timerInterval = setInterval(() => {
      this.pruneExpired();
      //Trigger the Vuex time update that will cause the countdowns to render
      this.$store.commit('updateNow');
    }, 1000);

    setInterval(() => {
      //Fetch the API every 30 seconds to check for new races.
      this.fetchApi();
    }, 1000 * 30);
  },
  components: {
    Race,
  },
};
</script>


<style scoped lang="scss">
section.next-to-go {
  max-width: 800px;
  margin: 0 auto;
  width: 95%;
  border: 1px solid #eee;
  border-radius: 20px;
  text-align: left;
  overflow: hidden;

  .header {
    background: #232323;  
    display: flex;
    flex-basis: 158px;

    .buttons {
      padding: 4px 10px;
    }

    button {
      display: inline-block;
      font-weight: 400;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      user-select: none;
      border: 1px solid transparent;
      padding: 0px 15px;
      font-size: 1rem;
      line-height: 1.5;
      border-radius: .25rem;
      transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
      color: #fff;
      background-color: #6c757d;
      border-color: #6c757d;
      cursor: pointer;

      &.active,
      &:hover {
        color: #fff;
        background-color: #545b62;
        border-color: #4e555b;
      }
    }

    button:not(:last-child) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    button:not(:first-child) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }

  h1 {
    line-height: 35px;
    flex-grow: 1;
    color: #fff;
    font-size: 12px;
    text-transform: uppercase;
    padding: 0 0 0 15px;
    font-weight: 600;
    margin: 0;
  }

 

  .race:nth-of-type(2n) {
    background: #eee;
  }
}
</style>
