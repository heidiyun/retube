import { Vue, Component, Prop } from 'vue-property-decorator';

// @ts-ignore
@Component({})
export default class PieChart extends Vue {
  @Prop()
  private value!: number[];
  @Prop()
  private names!: string[];
  private data = [];

  private drawChart() {
    var data = google.visualization.arrayToDataTable(this.data);

    var options = {
      title: 'Language Composition',
      colors: [
        '#6F6456',
        '#CDDC49',
        '#CB7E94',
        '#E94B30',
        '#FEE659',
        '#A1CFDD',
      ],
    };

    let chart = new google.visualization.PieChart(
      document.getElementById('pieChart')
    );

    chart.draw(data, options);
  }

  private mounted() {
    this.names.shift();
    this.data.push(['Task', 'Hours per Day']);

    for (let i = 0; i < this.names.length; i++) {
      this.data.push([this.names[i], this.value[i]]);
    }
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawChart);
  }
}
