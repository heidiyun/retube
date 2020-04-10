<template>
  <div>
    <a-input-search
      placeholder="input search text"
      style="width: 400px"
      v-model="inputText"
      @search="onSearch"
    />
    <br />
    <br />
    <div class="video" v-html="videoHtml"></div>
    <div class="comment-layout">
      <div class="comment-container" v-for="(comment, i) in comments" :key="'card' + i">
        <div
          class="comment"
          v-html="comment.comment.snippet.topLevelComment.snippet.textDisplay"
          :show="comment.comment.snippet.topLevelComment.etag === showAll"
        ></div>

        <a-button
          v-show="heights[i] ? heights[i].scrollHeight > 80 : false"
          @click="showAll = showAll === '' ?  comment.comment.snippet.topLevelComment.etag : ''"
        >{{showAll === comment.comment.snippet.topLevelComment.etag ? '간략히' : '자세히보기'}}</a-button>

        <a-button
          v-show="comment.replies.length !==0"
          @click="showReply = showReply === '' ?  comment.comment.snippet.topLevelComment.etag : ''"
        >답글{{comment.replies ? comment.replies.length : ''}}</a-button>
        <div
          v-show="showReply === comment.comment.snippet.topLevelComment.etag"
          v-for="(reply, j) in  comment.replies ? comment.replies : 0"
          :key="'reply' + j"
        >
          <div v-html="reply.snippet.textDisplay"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "./home.scss";
</style>
<script src="./home.ts"></script>
