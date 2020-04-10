import { Vue, Component } from 'vue-property-decorator';
import { google } from 'googleapis';
import axios from 'axios';

@Component({})
export default class Home extends Vue {
  private videoHtml: string = '';
  private comments = [];
  private inputText: string = 'https://www.youtube.com/watch?v=BkkD6qsPAsIC';
  private channelId: string = '';
  private showAll: string = '';
  private showReply: string = '';
  private commentsHeight: number[] = [];

  private onSearch() {
    const index = this.inputText.indexOf('v=');
    const index2 = this.inputText.indexOf('&');

    if (index2 === -1) {
      this.channelId = this.inputText.slice(index + 2);
    } else {
      this.channelId = this.inputText.slice(index + 2, index2);
    }

    this.call();
  }

  private get heights() {
    const elements = document.getElementsByClassName('comment');
    elements.length;

    return elements;
  }

  private async call() {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/videos',
      {
        params: {
          key: 'AIzaSyDwidB_NFs_0mXXP5DyYXAMWZ3FJX3B4cU',
          part: 'snippet, statistics, player',
          id: `${this.channelId}`,
          fields:
            'items(snippet(title, description,  channelId), statistics(viewCount), player)'
        }
      }
    );

    console.log(response.data);
    this.videoHtml = response.data.items[0].player.embedHtml;

    let nextPageToken = '';

    // while (nextPageToken !== undefined) {
    const response2 = await axios.get(
      'https://www.googleapis.com/youtube/v3/commentThreads',
      {
        params: {
          key: 'AIzaSyDwidB_NFs_0mXXP5DyYXAMWZ3FJX3B4cU',
          part: 'snippet, replies',
          videoId: `${this.channelId}`,
          pageToken: `${nextPageToken}`,
          order: 'relevance',
          textFormat: 'html',
          fields:
            'nextPageToken, pageInfo(totalResults, resultsPerPage), items(snippet, replies)'
        }
      }
    );

    console.log(response2.data);
    nextPageToken = response2.data.nextPageToken;

    response2.data.items.forEach(async item => {
      const parentId = item.snippet.topLevelComment.id;
      let replies = await axios.get(
        'https://www.googleapis.com/youtube/v3/comments',
        {
          params: {
            key: 'AIzaSyDwidB_NFs_0mXXP5DyYXAMWZ3FJX3B4cU',
            part: 'snippet',
            parentId: `${parentId}`,
            fields: 'items(snippet)'
          }
        }
      );

      let a = {
        comment: item,
        replies: replies.data.items
      };
      this.comments.push(a);
    });

    // }
  }

  public async mounted() {}
}
