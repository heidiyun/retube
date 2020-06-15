import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/home';
import Main from '@/views/main';
import Search from '@/views/search';
import PieChart from '@/views/component/pie-chart';
import WordCloud from '@/views/component/word-cloud';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'main',
    component: Main,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/chart',
    name: 'chart',
    component: PieChart,
  },

  {
    path: '/cloud',
    name: 'cloud',
    component: WordCloud,
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
