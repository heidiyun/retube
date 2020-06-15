<template>
  <div class="video-list">
    <div
      class="video-list-item"
      v-for="(video,i) in displayVideoList"
      :key="i"
      @click="setSrc(video.videoHtml)"
    >
      <div class="video">
        <iframe :src="video.videoHtml" width="260" height="140"></iframe>
      </div>
      <div class="description">
        <div class="title" v-html="video.title"></div>
        <div class="name-container">
          <div class="name">{{video.name}}</div>
        </div>
        <div style="display:flex;">
          <div class="view-count">조회수 {{video.viewCount}}회&nbsp;·</div>
          <div class="date" style="margin-left:4px;">{{video.publishedAt}}</div>
        </div>
        <div class="explanation">{{video.description}}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "./search.scss";
</style>

<script src="./search.ts">
</script>