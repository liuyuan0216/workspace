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
import Print from 'vue-print-nb'
axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;
Vue.use(Mui);
Vue.use(Vuex);
Vue.use(Print);
//引入vux
import { ConfirmPlugin } from 'vux'
Vue.use(ConfirmPlugin)

Vue.prototype.$print = Print;
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
import '../static/css/common.css'

import { locationData, local, version, phoneText, phoneNull, phoneFormat, passwordText, passwordFormat, shText, shFormat, numFormat, $ajaxjp, isPhoneAvailable, isPssword, isEmail, isSh, isNumber } from './components/common.js';
Vue.config.productionTip = false

Vue.prototype.locationData = locationData;
Vue.prototype.local = local;
Vue.prototype.version = version;

Vue.prototype.phoneText = phoneText;
Vue.prototype.phoneNull = phoneNull;
Vue.prototype.phoneFormat = phoneFormat;

Vue.prototype.passwordText = passwordText;
Vue.prototype.passwordFormat = passwordFormat;

Vue.prototype.emailText = passwordText;
Vue.prototype.emailFormat = passwordFormat;

Vue.prototype.shText = shText;
Vue.prototype.shFormat = shFormat;

Vue.prototype.numFormat = numFormat;

Vue.prototype.$ajaxjp = $ajaxjp;
Vue.prototype.isPhoneAvailable = isPhoneAvailable;
Vue.prototype.isPssword = isPssword;
Vue.prototype.isEmail = isEmail;
Vue.prototype.isSh = isSh;
Vue.prototype.isNumber = isNumber;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

var store = new Vuex.Store({
  state: {
    recruitScrollY:0,
    isLogin: 'hub'
  },
  getters: {
    recruitScrollY:state => state.recruitScrollY
  },
  mutations: {
    changeRecruitScrollY(state,recruitScrollY) {
      state.recruitScrollY = recruitScrollY
    },
    loginStatus(state,data){
      state.isLogin = data;
    }
  },
  actions: {

  },
  modules: {}
})
Vue.prototype.$store = store;
