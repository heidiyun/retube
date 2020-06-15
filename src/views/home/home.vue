<template>
  <div class="home-container">
    <div class="video">
      <iframe :src="videoHtml" width="890" height="500"></iframe>
      <div class="video-title" v-html="videoInfo.title"></div>
      <div class="video-info">
        <div style="line-height: 33px">조회수 {{videoInfo.viewCount}}회 · {{videoInfo.publishedAt}}</div>
      </div>
      <div class="tag-container">
        <a-tag
          class="tag"
          v-for="tag in tags"
          :key="tag"
          :color="selectedTag === tag ?'#108ee9': 'blue'"
          @click="clickTag(tag)"
        >#{{tag}}</a-tag>
      </div>
      <div class="video-list">
        <div
          class="video-list-item"
          v-for="(video,i) in displayVideoList"
          :key="i"
          @click="setSrc(video.videoHtml)"
        >
          <div class="video">
            <iframe :src="video.videoHtml" width="350" height="210"></iframe>
          </div>
          <div class="description">
            <div class="title" v-html="video.title"></div>
            <div class="name-container">
              <div class="name">{{video.name}} · 조회수 {{video.viewCount}}</div>

              <div class="view-count"></div>
              <div class="date"></div>
            </div>
            <div class="explanation">{{video.description}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="comment-info-container">
      <v-btn text @click="() => (showAnalysis = showAnalysis ? false : true)" style="padding:2px">
        {{showAnalysis ? '접기' : '더보기'}}
        <v-icon v-if="!showAnalysis">mdi-chevron-down</v-icon>
        <v-icon v-if="showAnalysis">mdi-chevron-up</v-icon>
      </v-btn>
      <!-- <div class="spinner" v-show="!isLoad">
        <a-spin />
      </div>-->
      <div class="comment-analysis-layout" :displayed="showAnalysis">
        <!-- <word-cloud v-if="showPieChart" :entities="keywords"></word-cloud> -->
        <div id="cloud-canvas" style="width :100%; height : 200px;"></div>
        <div class="pie-chart-container">
          <pie-chart
            v-if="showPieChart"
            :names="displayLangTypes"
            :value="displayLangTypeValues"
            style="width:450px;height:200px;"
          ></pie-chart>
          <p-chart v-if="showPieChart" :value="percentageOfSenti" style="width:450px;height:200px;"></p-chart>
        </div>
      </div>

      <v-select
        :items="displayLangTypes"
        label="언어 선택"
        dense
        outlined
        v-model="selectedLang"
        @change="showCommentByLangType"
      ></v-select>
      <!-- <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item
            v-for="type in displayLangTypes"
            :key="type"
            @click="showCommentByLangType(type)"
          >{{ type }}</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          Button
          <a-icon type="down" />
        </a-button>
      </a-dropdown>-->
      <!-- <a-dropdown>
        <a-menu slot="ove
        rlay">
          <a-menu-item v-for="type in 6" :key="type" @click="showCommentByLangType(type)">{{ type }}</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          Button
          <a-icon type="down" />
        </a-button>
      </a-dropdown>-->

      <!-- <div class="spinner" v-show="!isLoad">
        <a-spin></a-spin>
      </div>-->
      <div class="comment-layout">
        <div class="comment-container" v-for="(comment, i) in displayComments" :key="'card' + i">
          <div class="comment" :show="comment.comment.snippet.topLevelComment.etag === showAll">
            <div class="image" :reply="false">
              <img
                :src="
                  comment.comment.snippet.topLevelComment.snippet
                    .authorProfileImageUrl
                "
                width="34"
                height="34"
                style="border-radius:50%;"
              />
            </div>
            <div class="text-line">
              <div class="name">
                {{
                comment.comment.snippet.topLevelComment.snippet
                .authorDisplayName
                }}
              </div>
              <div
                class="text"
                v-if="
                  translatedCommentId ===
                    comment.comment.snippet.topLevelComment.etag &&
                    isTranslate
                "
              >{{ resultOfTranslation }}</div>
              <div
                class="text"
                v-else
                v-html="
                  comment.comment.snippet.topLevelComment.snippet.textDisplay
                "
              ></div>
            </div>
          </div>

          <div class="optional-button-layout">
            <div
              class="optional-button"
              v-show="heights[i] ? heights[i].scrollHeight > 80 : false"
              @click="
                showAll =
                  showAll === ''
                    ? comment.comment.snippet.topLevelComment.etag
                    : ''
              "
              text
            >
              {{
              showAll === comment.comment.snippet.topLevelComment.etag
              ? '간략히'
              : '자세히보기'
              }}
            </div>

            <div
              class="optional-button"
              v-show="comment.lang !== '한국어'"
              @click="translateComment(comment)"
              text
            >{{ translatedCommentId === comment.comment.snippet.topLevelComment.etag && isTranslate ? '원문보기' : '번역보기'}}</div>
          </div>
          <div class="likeCount" style="display:flex; margin-left : 52px">
            <div>
              <v-icon small>mdi-thumb-up</v-icon>
              {{comment.comment.snippet.topLevelComment.snippet
              .likeCount}}
            </div>
            <div style="margin-left : 8px;">
              <v-icon small>mdi-thumb-down</v-icon>
            </div>
          </div>
          <a-button
            v-show="comment.replies.length !== 0"
            type="link"
            style="margin-left:29px;"
            @click="
              showReply =
                showReply === ''
                  ? comment.comment.snippet.topLevelComment.etag
                  : ''
            "
          >
            <v-icon style="margin-bottom:6px;">mdi-menu-down</v-icon>
            답글 {{ comment.replies ? comment.replies.length : '' }}개 보기
          </a-button>

          <div
            v-show="showReply === comment.comment.snippet.topLevelComment.etag"
            class="comment-container"
            v-for="(reply, j) in comment.replies ? comment.replies : 0"
            :key="'reply' + j"
            style="margin-left:30px"
            :reply="true"
          >
            <div class="comment">
              <div class="image">
                <img
                  :src="reply.snippet.authorProfileImageUrl"
                  width="30"
                  height="30"
                  style="border-radius:50%;"
                />
              </div>
              <div class="text-line">
                <div class="name">{{ reply.snippet.authorDisplayName }}</div>
                <div class="text" v-html="reply.snippet.textDisplay"></div>
              </div>
            </div>
          </div>
        </div>
        <!-- <a-button v-if="isMore" @click="showMoreComments">댓글 더보기...</a-button> -->
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "./home.scss";
</style>
<script src="./home.ts"></script>
