import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/home';
import cors from 'cors';

Vue.use(VueRouter);

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
