import { Vue, Component } from 'vue-property-decorator';
import axios from 'axios';

export interface VideoFormat {
  videoHtml: string;
  title: string;
  name: string;
  description: string;
  viewCount: string;
}

@Component({})
export default class Main extends Vue {
  private key = '';
  private videoList: Array<VideoFormat> = [];

  private async call() {
    const result = await axios.get(
      'https://www.googleapis.com/youtube/v3/videos',
      {
        params: {
          part: 'snippet, id, contentDetails, player, statistics, topicDetails',
          key: this.key,
          fields:
            'etag, nextPageToken, pageInfo, items(snippet(publishedAt, title, channelTitle,description,  channelId, thumbnails, tags), statistics(viewCount, likeCount, dislikeCount), player)',
          chart: 'mostPopular',
          pageToken: '',
          regionCode: 'KR',
          maxResults: '80',
        },
      }
    );

    console.log(result.data);

    result.data.items.forEach((item: any) => {
      const date = item.snippet.publishedAt.split('T')[0].replace(/-/gi, '.');
      const info = {
        videoHtml: item.player.embedHtml.split('src')[1].split('"')[1],
        title: item.snippet.title,
        name: item.snippet.channelTitle,
        description: item.snippet.description,
        viewCount: this.formatViewCount(item.statistics.viewCount),
        publishedAt: date,
      };

      this.videoList.push(info);
    });
  }

  private formatViewCount(viewCount: number): string {
    let result: string = '';
    if (viewCount > 10000000) {
      result = Math.floor(viewCount * 0.0001) + '만';
    } else if (viewCount > 1000000) {
      result = Math.floor(viewCount * 0.0001) + '만';
    } else if (viewCount > 100000) {
      result = Math.floor(viewCount * 0.0001) + '만';
    } else if (viewCount > 10000) {
      result = Math.floor(viewCount * 0.0001) + '만';
    } else if (viewCount > 1000) {
      result = Math.floor(viewCount * 0.001) + '천';
    }

    return result;
  }
  private setSrc(video: VideoFormat) {
    this.$store.commit('setSrc', video.videoHtml);
    this.$router.push('/home');
  }

  private mounted() {
    this.call();
  }
}
