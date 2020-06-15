import { Component, Vue, Watch } from 'vue-property-decorator';
import axios from 'axios';

export interface VideoFormat {
  videoHtml: string;
  title: string;
  name: string;
  description: string;
  viewCount: string;
  publishedAt: string;
}

@Component({})
export default class Search extends Vue {
  private key = '';
  private videoList: Array<VideoFormat> = [];

  @Watch('$store.getters.searchText')
  private async call() {
    this.videoList = [];
    console.log('store', this.$store.getters.searchText);
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          q: this.$store.getters.searchText,
          key: this.key,
          part: 'snippet',
          type: 'video',
          maxResults: 15,
        },
      }
    );

    console.log(response.data);
    response.data.items.forEach(async (item: any) => {
      const videoInfo: VideoFormat = {
        videoHtml: '',
        title: item.snippet.title,
        name: item.snippet.channelTitle,
        description: item.snippet.description,
        viewCount: '',
      };

      const videoId = item.id.videoId;

      const response2 = await axios.get(
        'https://www.googleapis.com/youtube/v3/videos',
        {
          params: {
            key: this.key,
            part: 'snippet, statistics, player',
            id: videoId,
            fields:
              'items(snippet(publishedAt,title, description,  channelId), statistics(viewCount, likeCount, dislikeCount, commentCount), player)',
          },
        }
      );

      videoInfo.videoHtml = response2.data.items[0].player.embedHtml
        .split('src')[1]
        .split('"')[1];
      videoInfo.viewCount = this.formatViewCount(
        response2.data.items[0].statistics.viewCount
      );
      videoInfo.publishedAt = response.data.items[0].snippet.publishedAt
        .split('T')[0]
        .replace(/-/gi, '.');
      this.videoList.push(videoInfo);
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

  private setSrc(src: string) {
    this.$store.commit('setSrc', src);
    this.$router.push('/home');
  }

  private get displayVideoList() {
    return this.videoList;
  }

  private mounted() {
    this.call();
  }
}
