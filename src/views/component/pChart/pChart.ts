import { Vue, Component, Prop } from 'vue-property-decorator';

// @ts-ignore
@Component({})
export default class PChart extends Vue {
  @Prop()
  private value!: number[];
  @Prop()
  private names!: string[];
  private data = [];

  private drawChart() {
    var data = google.visualization.arrayToDataTable(this.data);

    var options = {
      title: 'Sentiment composition',
      colors: ['#86BBD8', '#758E4F', '#F6AE2D'],
    };

    let chart = new google.visualization.PieChart(
      document.getElementById('pChart')
    );

    chart.draw(data, options);
  }

  private mounted() {
    if (!this.names) {
      this.names = ['중립', '부정', '긍정'];
    }

    this.data.push(['Task', 'Hours per Day']);

    for (let i = 0; i < this.names.length; i++) {
      this.data.push([this.names[i], this.value[i]]);
    }
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawChart);
  }
}
