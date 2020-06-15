import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export interface State {
  src: string | undefined;
  searchText: string | undefined;
}

export default new Vuex.Store<State>({
  state: {
    src: undefined,
    searchText: undefined,
  },
  mutations: {
    setSrc(state, payload) {
      state.src = payload;
    },
    setSearchText(state, payload) {
      state.searchText = payload;
    },
  },
  getters: {
    src(state) {
      return state.src;
    },
    searchText(state) {
      return state.searchText;
    },
  },
  actions: {},
  modules: {},
});
