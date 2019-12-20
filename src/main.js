import Vue from 'vue';
import App from './App.vue';
Vue.config.productionTip = false;

import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard);

import SlideOut from '@hyjiacan/vue-slideout'
import '@hyjiacan/vue-slideout/lib/slideout.css'
Vue.use(SlideOut, {
  // set props here
});

// add components
const files = require.context('./components', true, /\.vue$/i);
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))
new Vue({
  render: h => h(App),
}).$mount('#app');
