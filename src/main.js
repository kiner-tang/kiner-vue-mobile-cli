/* eslint-disable no-console,no-unused-vars */
import Vue from "vue";
import "./cube-ui";
import App from "./App.vue";
import router from "./router";
import "amfe-flexible";
import config from "./utils/config";

import VConsole from "vconsole";

import _, {resetFontSize} from "./utils/_tools";

import "./utils/vue-filter";

import VueAwesomeSwiper from "vue-awesome-swiper";

// require styles
import "swiper/dist/css/swiper.css";

import store from './store/index'

Vue.use(VueAwesomeSwiper);


if (config.vconsole) {
  Vue.prototype.vConsole = new VConsole();
}

Vue.prototype.$fetch = _.fetch;
Vue.prototype.$register = _.register;
Vue.prototype._ = _;
Vue.prototype.$$ = _.optionalChaining;

Vue.prototype.$config = config;

Vue.config.productionTip = false;

resetFontSize();


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
