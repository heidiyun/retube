import { Component, Vue } from 'vue-property-decorator';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import axios from 'axios';
import firebaseConfig from '@/firebaseConfig';
import firebase from 'firebase';
import PieChart from '@/views/component/pie-chart';
import WordCloud from '@/views/component/word-cloud';
import PChart from '@/views/component/pChart';

Vue.use(Antd);
Vue.component('pie-chart', PieChart);
Vue.component('p-chart', PChart);
Vue.component('word-cloud', WordCloud);

@Component({})
export default class App extends Vue {
  private inputText: string = '';

  private async onSearch() {
    this.$store.commit('setSearchText', this.inputText);
    const regex = /^http[s]?\:\/\//i;

    if (regex.test(this.inputText)) {
      if (this.$route.path !== '/home') {
        this.$router.push('/home');
      }
    } else {
      if (this.$route.path !== '/search') {
        this.$router.push('/search');
      }
    }
  }

  private goHome() {
    this.$router.push('/');
  }

  private mounted() {
    // block
  }
}
