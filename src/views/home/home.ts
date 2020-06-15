import { Vue, Component, Watch } from 'vue-property-decorator';
import axios from 'axios';
import firebase, { app } from 'firebase';
import firebaseConfig from '@/firebaseConfig';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { thresholdFreedmanDiaconis } from 'd3';
import { Word, TagCloud, Options } from 'd3-tagcloud';
import { VAutocomplete } from 'vuetify/lib';
export interface VideoFormat {
  videoHtml: string;
  title: string;
  name: string;
  description: string;
  viewCount: string;
}

@Component({})
export default class Home extends Vue {
  private isLoad: boolean = false;
  private selectedComment: string = '';
  private selectedLang: string = '';
  private percentageOfSenti: number[] = [];
  private layout: any;
  private showAnalysis: boolean = true;
  private videoInfo = {};
  private videoHtml: string = '';
  private comments = [];
  private displayComments = [];
  private inputText: string = '';
  private channelId: string = '';
  private showAll: string = '';
  private showReply: string = '';
  private commentsHeight: number[] = [];
  private nextPageToken: string = '';
  private isMore: boolean = false;
  private key = '';
  private dataOfLangTypes: {
    [key: string]: firebase.firestore.DocumentData[];
  } = {};
  private langTypes: string[] = [];
  private translatedText: string = '';
  private translatedCommentId: string = '';
  private isTranslate: boolean = false;
  private sentiments: { [key: string]: firebase.firestore.DocumentData[] } = {};
  private keywords: string[] = [];
  private tagCloud!: TagCloud;
  private videoList: VideoFormat[] = [];
  private strHtml: string = ' ';
  private selectedTag: string = '';
  private langToKorean = {
    all: '전체',
    ko: '한국어',
    en: '영어',
    ja: '일본어',
    'zh-cn': '중국어 간체',
    hi: '힌디어',
    es: '스페인어',
    fr: '프랑스어',
    de: '독일어',
    pt: '포르투갈어',
    vi: '베트남어',
    id: '인도네시아어',
    fa: '페르시아어',
    ar: '아랍어',
    mm: '미얀마어',
    th: '태국어',
    ru: '러시아어',
    it: '이탈리아어',
  };
  private KoreanToLang = {
    한국어: 'ko',
    영어: 'en',
    일본어: 'ja',
    'zh-cn': '중국어 간체',
    hi: '힌디어',
    es: '스페인어',
    프랑스어: 'fr',
    de: '독일어',
    pt: '포르투갈어',
    베트남어: 'vi',
    인도네시아어: 'id',
    fa: '페르시아어',
    ar: '아랍어',
    mm: '미얀마어',
    th: '태국어',
    ru: '러시아어',
    it: '이탈리아어',
  };

  private get entites() {
    console.log('entitie', this.keywords);
    return this.keywords;
  }

  private get displayVideoList() {
    return this.videoList;
  }

  private async getVideoList(tag: string) {
    this.videoList = [];

    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          q: tag,
          key: this.key,
          part: 'snippet',
          type: 'video',
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

      this.videoList.push(videoInfo);
    });
  }

  @Watch('$store.getters.searchText')
  private onSearch(channelId?: string) {
    this.inputText = this.$store.getters.searchText;
    console.log('me', this.inputText, channelId, this.inputText);
    this.comments = [];
    this.nextPageToken = '';
    firebase
      .firestore()
      .collection(`comments/`)
      .get()
      .then((querysnapshot) => {
        querysnapshot.forEach(async (doc) => {
          await firebase
            .firestore()
            .collection('comments/')
            .doc(doc.id)
            .delete();
        });
      });

    if (channelId) {
      this.channelId = channelId;
      console.log('dlksjdf', this.channelId);
    } else {
      const index = this.inputText.indexOf('v=');
      const index2 = this.inputText.indexOf('&');

      if (index2 === -1) {
        this.channelId = this.inputText.slice(index + 2);
      } else {
        this.channelId = this.inputText.slice(index + 2, index2);
      }
    }
    this.inputText = '';

    this.call();
  }

  private get heights() {
    const elements = document.getElementsByClassName('comment');
    elements.length;

    return elements;
  }

  private showMoreComments() {
    this.displayComments = this.displayComments.concat(
      this.comments.slice(
        this.displayComments.length,
        this.displayComments.length + 20
      )
    );

    this.isMore = this.comments.length > this.displayComments.length;
  }

  private get showPieChart() {
    return this.percentageOfSenti.length === 3 ? true : false;
  }

  private get tags() {
    console.log('tags', this.videoInfo.tags);
    return this.videoInfo.tags;
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

  private async call() {
    this.dataOfLangTypes = {};
    this.langTypes = [];
    this.sentiments = {};
    this.percentageOfSenti = [];
    this.keywords = [];

    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/videos',
      {
        params: {
          key: this.key,
          part: 'snippet, statistics, player',
          id: `${this.channelId}`,
          fields:
            'items(snippet(publishedAt,title, description,  channelId, tags), statistics(viewCount, likeCount, dislikeCount, commentCount), player)',
        },
      }
    );

    this.videoInfo = {
      vidoeHtml: response.data.items[0].player.embedHtml,
      title: response.data.items[0].snippet.title,
      name: response.data.items[0].channelTitle,
      description: response.data.items[0].snippet.description,
      viewCount: this.formatViewCount(
        response.data.items[0].statistics.viewCount
      ),
      publishedAt: response.data.items[0].snippet.publishedAt
        .split('T')[0]
        .replace(/-/gi, '.'),
      tags: response.data.items[0].snippet.tags,
    };

    this.videoHtml = response.data.items[0].player.embedHtml
      .split('src')[1]
      .split('"')[1];

    // response.data.items snippet.title snippet.description statistics.viewCount

    while (this.nextPageToken !== undefined) {
      const response2 = await axios.get(
        'https://www.googleapis.com/youtube/v3/commentThreads',
        {
          params: {
            key: this.key,
            part: 'snippet, replies',
            videoId: `${this.channelId}`,
            pageToken: `${this.nextPageToken}`,
            order: 'relevance',
            textFormat: 'html',
            maxResults: 100,
            fields:
              'nextPageToken, pageInfo(totalResults, resultsPerPage), items(snippet, replies)',
          },
        }
      );

      this.nextPageToken = response2.data.nextPageToken;
      this.isMore = this.nextPageToken === undefined ? false : true;

      for (let i = 0; i < response2.data.items.length; i++) {
        // @ts-ignore
        const item = response2.data.items[i];
        const parentId = item.snippet.topLevelComment.id;
        const replies = await axios.get(
          'https://www.googleapis.com/youtube/v3/comments',
          {
            params: {
              key: this.key,
              part: 'snippet',
              parentId: `${parentId}`,
              fields: 'items(snippet)',
            },
          }
        );

        const lang = await axios.get(
          'http://localhost:5001/re-tube-272909/us-central1/widgets',
          {
            params: {
              text: item.snippet.topLevelComment.snippet.textOriginal,
            },
          }
        );

        const sentiment = await axios.get(
          'http://localhost:5001/re-tube-272909/us-central1/naturalLanguage',
          {
            params: {
              text: item.snippet.topLevelComment.snippet.textOriginal,
            },
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods':
                'GET, POST, PUT, DELETE, PATCH, OPTIONS',
              'Access-Control-Allow-Headers':
                'X-Requested-With, content-type, Authorization',
            },
          }
        );

        const entity = await axios.get(
          'http://localhost:5001/re-tube-272909/us-central1/getEntity',
          {
            params: {
              text: item.snippet.topLevelComment.snippet.textOriginal,
            },
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods':
                'GET, POST, PUT, DELETE, PATCH, OPTIONS',
              'Access-Control-Allow-Headers':
                'X-Requested-With, content-type, Authorization',
            },
          }
        );

        // this.langTypes.add(lang.data.langCode);
        //image : authorProfileImageURL
        //name : authorDisplayName
        //likeCount
        // publishedAt
        await firebase
          .firestore()
          .collection(`comments/`)
          .add({
            comment: item,
            id: item.snippet.topLevelComment.etag,
            replies: replies.data.items,
            lang: this.langToKorean[lang.data.langCode],
            sentiment: sentiment.data,
            entity: entity.data,
          });

        // firebase
        //   .database()
        //   .ref('comments/' + item.snippet.topLevelComment.etag)
        //   .set({
        //     comment: item.snippet.topLevelComment.snippet.textDisplay,
        //     replies: replies.data.items,
        //     lang: lang.data.langCode,
        //   });

        const commentInfo = {
          comment: item,
          id: item.snippet.topLevelComment.etag,
          replies: replies.data.items,
          lang: lang.data.langCode,
          sentiment: sentiment.data,
        };
        // @ts-ignore
        this.comments.push(commentInfo);
      }
    }

    await firebase
      .firestore()
      .collection(`comments`)
      .get()
      .then((querysnapshot) => {
        querysnapshot.forEach(async (doc) => {
          // const commentInfo = {
          //   comment: doc.data().comment,
          //   id: doc.data().id,
          //   replies: doc.data().replies,
          //   lang: doc.data().lang,
          //   sentiment: doc.data().sentiment,
          // };
          // // @ts-ignore
          // this.comments.push(commentInfo);

          const lang = doc.data().lang;
          if (!this.dataOfLangTypes[lang]) {
            this.dataOfLangTypes[lang] = [];
          }

          this.dataOfLangTypes[lang].push(doc.data());

          const sentiment = doc.data().sentiment;

          if (!this.sentiments[sentiment]) {
            this.sentiments[sentiment] = [];
          }
          this.sentiments[sentiment].push(doc.data());

          doc.data().entity.forEach((e) => {
            this.keywords.push(e.name);
          });
        });
      });

    this.displayComments = this.comments;
    // if (this.comments.length > 20) {
    //   this.displayComments = this.comments.slice(0, 20);
    // } else {
    //   this.displayComments = this.comments;
    // }

    // console.log('comments', this.displayComments);

    this.isMore = this.comments.length > this.displayComments.length;

    this.langTypes = Object.keys(this.dataOfLangTypes);

    this.isLoad = true;

    const element: HTMLElement = <HTMLElement>(
      document.getElementById('cloud-canvas')
    );

    let tags = [];

    this.tagCloud = new TagCloud(element);

    let options: Options = {
      orientation: 'single',
      maxFontSize: 25,
      minFontSize: 5,
      seedColors: ['#999999'],

      //  default is 'right angled','single','right angled','multiple'
    };
    this.tagCloud.setOptions(options);
    // tagCloud.setOptions(opt:Options);

    // tags.push({
    //   value: ~~(Math.random() * 10000) / 100,
    //   text: this.keywords[i],
    // });

    const loopCount = this.keywords.length > 40 ? 40 : this.keywords.length;

    for (let i = 0; i < loopCount; i++) {
      if (
        this.keywords[i].indexOf('https') !== -1 ||
        this.keywords[i].indexOf('www') !== -1 ||
        this.keywords[i].length > 5
      ) {
        continue;
      }

      if (tags.length > 20) {
        break;
      }
      tags.push({
        value: ~~(Math.random() * 10000) / 100,
        text: this.keywords[i],
      });
    }

    this.tagCloud.setData(tags);

    // this.langTypes.unshift('all');

    // }

    if (this.sentiments.neutral) {
      this.percentageOfSenti.push(this.sentiments.neutral.length);
    } else {
      this.percentageOfSenti.push(0);
    }

    if (this.sentiments.negative) {
      this.percentageOfSenti.push(this.sentiments.negative.length);
    } else {
      this.percentageOfSenti.push(0);
    }

    if (this.sentiments.positive) {
      this.percentageOfSenti.push(this.sentiments.positive.length);
    } else {
      this.percentageOfSenti.push(0);
    }
  }

  private get sentimentValue() {
    return this.sentiments;
  }

  private clickTag(tag: string) {
    this.selectedTag = tag;
    this.getVideoList(tag);
  }

  private async translateComment(commentInfo: any) {
    if (this.isTranslate) {
      // this.translatedText = commentInfo.comment.snippet.textDisplay;
      this.isTranslate = false;
      return;
    }
    this.isTranslate = true;
    this.selectedComment = commentInfo.comment.snippet.topLevelComment.etag;
    if (!this.isTranslate) {
      return;
    }
    this.translatedText = '';
    this.translatedCommentId = commentInfo.comment.snippet.topLevelComment.etag;
    const result = await axios.get(
      'http://localhost:5001/re-tube-272909/us-central1/translate',
      {
        params: {
          text:
            commentInfo.comment.snippet.topLevelComment.snippet.textOriginal,
          source: this.KoreanToLang[commentInfo.lang],
        },
      }
    );

    this.translatedText = result.data.message.result.translatedText;

    console.log(this.translatedText);
  }

  private get resultOfTranslation() {
    console.log('t', this.translatedText);
    return this.translatedText;
  }

  private get displayLangTypes() {
    console.log('lang');
    console.log(this.langTypes);
    this.langTypes.unshift('전체');
    return this.langTypes;
  }

  private get displayLangTypeValues() {
    const values: number[] = [];
    Object.keys(this.dataOfLangTypes).forEach((key) =>
      values.push(this.dataOfLangTypes[key].length)
    );
    return values;
  }

  private showCommentByLangType() {
    console.log(this.selectedLang);
    if (this.selectedLang === '전체') {
      this.displayComments = this.comments;
    } else {
      // @ts-ignore
      // this.displayComments = this.comments.filter(
      //   (comment) => comment.lang === type
      // );
      this.displayComments = this.dataOfLangTypes[this.selectedLang];
      console.log(this.dataOfLangTypes[this.selectedLang]);
    }
  }

  private async mounted() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // const element: HTMLElement = <HTMLElement>(
    //   document.getElementById('cloud-canvas')
    // );
    // let tagCloud = new TagCloud(element);

    // let options: Options = {
    //   orientation: 'single',
    //   maxFontSize: 25,
    //   minFontSize: 5,
    //   seedColors: ['#999999'],

    //   //  default is 'right angled','single','right angled','multiple'
    // };
    // tagCloud.setOptions(options);
    // // tagCloud.setOptions(opt:Options);

    // let tags = [];
    // for (let i = 0; i < 100; i++) {
    //   tags.push({
    //     value: ~~(Math.random() * 10000) / 100,
    //     text: '공부' + i,
    //   });
    // }

    // tagCloud.setData(tags);

    if (this.$store.getters.src !== undefined) {
      const channelId = this.$store.getters.src.split('/')[4];
      this.onSearch(channelId);
    } else if (this.$store.getters.searchText !== undefined) {
      console.log('dkdk');
      this.inputText = this.$store.getters.searchText;
      this.onSearch();
    }

    // const ref = firebase.database().ref('comments/');
    // ref.once('child_added', (snapshot) => {
    //   snapshot.forEach((s) => {
    //     console.log(s.key);
    //     console.log(s.val);
    //   });
    // });
  }
}
