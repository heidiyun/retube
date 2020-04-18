import { Component, Vue } from 'vue-property-decorator';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import firebaseConfig from '@/firebaseConfig';
import firebase from 'firebase';

Vue.use(Antd);

@Component({})
export default class App extends Vue {
  private mounted() {
    // block
  }
}
