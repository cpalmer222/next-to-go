import { createStore, MutationTree } from 'vuex';

export interface State {
  now: number
}

const mutations = <MutationTree<State>>{
  updateNow(state) {
    state.now = Math.floor(Date.now() / 1000);
  },
};

export default createStore<State>({
  state: {
    // Use Vuex to store a "now" stamp that is updated every second, 
    // so all countdowns are syncronised and not using their own individual setInterval
    // Just a single global setInterval
    now: Math.floor(Date.now() / 1000),
  },
  mutations,
});
