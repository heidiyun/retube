import { Vue, Component } from 'vue-property-decorator';
import axios from 'axios';
import firebase from 'firebase';
import firebaseConfig from '@/firebaseConfig';

@Component({})
export default class Home extends Vue {
  private videoHtml: string = '';
  private comments = [];
  private inputText: string = '';
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
          key: '',
          part: 'snippet, statistics, player',
          id: `${this.channelId}`,
          fields:
            'items(snippet(title, description,  channelId), statistics(viewCount), player)',
        },
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
          key: '',
          part: 'snippet, replies',
          videoId: `${this.channelId}`,
          pageToken: `${nextPageToken}`,
          order: 'relevance',
          textFormat: 'html',
          fields:
            'nextPageToken, pageInfo(totalResults, resultsPerPage), items(snippet, replies)',
        },
      }
    );

    console.log(response2.data);
    nextPageToken = response2.data.nextPageToken;

    //@ts-ignore
    response2.data.items.forEach(async (item) => {
      const parentId = item.snippet.topLevelComment.id;
      let replies = await axios.get(
        'https://www.googleapis.com/youtube/v3/comments',
        {
          params: {
            key: '',
            part: 'snippet',
            parentId: `${parentId}`,
            fields: 'items(snippet)',
          },
        }
      );

      console.log('alkdjfa;j');

      // firebase
      //   .firestore()
      //   .collection('comments')
      //   .add({
      //     comment: item.snippet.topLevelComment.snippet.textDisplay,
      //     id: item.snippet.topLevelComment.etag,
      //   });

      firebase
        .database()
        .ref('comments/' + item.snippet.topLevelComment.etag)
        .set({
          comment: item.snippet.topLevelComment.snippet.textDisplay,
        });

      let a = {
        comment: item,
        replies: replies.data.items,
      };
      //@ts-ignore
      this.comments.push(a);
    });

    // }
  }

  public async mounted() {
    firebase.initializeApp(firebaseConfig);
  }
}
