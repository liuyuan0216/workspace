// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import store from './store'
import Mui from 'vue-awesome-mui'
import axios from 'axios'
import qs from 'qs'
import Vuex from 'vuex'
Vue.use(Mui);
Vue.use(Vuex)

Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
import '../static/css/common.css'

import { locationData, local, phoneText, phoneNull, phoneFormat, passwordText, passwordFormat,shText, shFormat, $ajaxjp, isPhoneAvailable, isPssword, isEmail, isSh } from './components/common.js';
Vue.config.productionTip = false

Vue.prototype.locationData = locationData;
Vue.prototype.local = local;

Vue.prototype.phoneText = phoneText;
Vue.prototype.phoneNull = phoneNull;
Vue.prototype.phoneFormat = phoneFormat;

Vue.prototype.passwordText = passwordText;
Vue.prototype.passwordFormat = passwordFormat;

Vue.prototype.emailText = passwordText;
Vue.prototype.emailFormat = passwordFormat;

Vue.prototype.shText = shText;
Vue.prototype.shFormat = shFormat;

Vue.prototype.$ajaxjp = $ajaxjp;
Vue.prototype.isPhoneAvailable = isPhoneAvailable;
Vue.prototype.isPssword = isPssword;
Vue.prototype.isEmail = isEmail;
Vue.prototype.isSh = isSh;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

var store = new Vuex.Store({
  state: {
    recruitScrollY:0
  },
  getters: {
    recruitScrollY:state => state.recruitScrollY
  },
  mutations: {
    changeRecruitScrollY(state,recruitScrollY) {
      state.recruitScrollY = recruitScrollY
    }
  },
  actions: {

  },
  modules: {}
})
Vue.prototype.$store = store;
