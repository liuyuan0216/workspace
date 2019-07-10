import Vue from 'vue';
import Vuex from 'vuex';
import VueJsonp from 'vue-jsonp'

Vue.use(Vuex)
Vue.use(VueJsonp)

const store = new Vuex.Store({
  state: {
    position: '',
  },
  mutations: {
    updateData(state, data) {
      state.position = data;
    }
  },
  actions: {

  }
});

export default store;
