import { Vue, Component, PropSync, Prop } from 'vue-property-decorator';
import { Word, TagCloud, Options } from 'd3-tagcloud';
import cloud from 'd3-cloud';
import * as d3 from 'd3';

@Component({})
export default class WordCloud extends Vue {
  @Prop()
  private entities!: string[];
  private layout: any;

//   private draw(words: any) {
//     console.log('draw');
//     d3.select('body')
//       .append('svg')
//       .attr('width', this.layout.size()[0])
//       .attr('height', this.layout.size()[1])
//       .append('g')
//       .attr(
//         'transform',
//         'translate(' +
//           this.layout.size()[0] / 2 +
//           ',' +
//           this.layout.size()[1] / 2 +
//           ')'
//       )
//       .selectAll('text')
//       .data(words)
//       .enter()
//       .append('text')
//       .style('font-size', function(d) {
//         return d.size + 'px';
//       })
//       .style('font-family', 'Impact')
//       .attr('text-anchor', 'middle')
//       .attr('transform', function(d) {
//         return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
//       })
//       .text(function(d) {
//         return d.text;
//       });
//   }

  private mounted() {
    // this.layout = cloud()
    //   .size([500, 500])
    //   .words(
    //     [
    //       '텍스트',
    //       '마이닝',
    //       '샘플',
    //       '좋아요',
    //       'R',
    //       'Word',
    //       'Cloud',
    //       'text',
    //       'mining',
    //     ].map(function(d) {
    //       return { text: d, size: 10 + Math.random() * 90, test: 'haha' };
    //     })
    //   )
    //   .padding(5)
    //   .rotate(function() {
    //     return ~~(Math.random() * 2) * 90;
    //   })
    //   .font('Impact')
    //   .on('end', this.draw);

    // this.layout.start();

    const element: HTMLElement = <HTMLElement>(
      document.getElementById('cloud-canvas')
    );
    let tagCloud = new TagCloud(element);

    let options: Options = {
      orientation: 'single',
      maxFontSize: 25,
      minFontSize: 5,
      seedColors: ['#999999'],

      //  default is 'right angled','single','right angled','multiple'
    };
    tagCloud.setOptions(options);
    let tags = [];
    for (let i = 0; i < this.entities.length; i++) {
      tags.push({
        value: ~~(Math.random() * 10000) / 100,
        teext: '공부' + i,
      });
    }
    // tagCloud.setOptions(opt:Options);

    console.log('tags', tags);

    tagCloud.setData(tags);
  }
}
