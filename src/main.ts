import Vue from 'vue';
import App from './app';
import router from './router';
import store from './store';
import './registerServiceWorker';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app');
