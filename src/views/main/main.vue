<template>
  <div class="video-list d-sm-flex">
    <v-flex
      class="ex"
      xl3
      lg3
      md4
      sm6
      xs12
      v-for="(video, i) in videoList"
      :key="i"
      @click="setSrc(video)"
    >
      <div class="video">
        <iframe width="300" height="170" :src="video.videoHtml"></iframe>
      </div>
      <div class="video-info">
        <!-- <div class="image" style=" width: 30px;
        height: 60px;">-->
        <!-- <img
            width="30"
            height="30"
            src="https://i.pinimg.com/originals/20/5b/8f/205b8f0dfd7212290810aade197b8a85.jpg"
            style="border-radius:50%;"
        />-->
        <!-- </div> -->

        <div>
          <div class="title" style="font-size:samll">{{video.title}}</div>
          <div>{{video.name}}</div>
          <div style="display:flex;">
            <div>조회수 {{video.viewCount}}회&nbsp;·</div>
            <div style="margin-left:4px;">{{video.publishedAt}}</div>
          </div>
        </div>
      </div>
    </v-flex>
    <!-- <div class="video-list-item" v-for="(video,i) in videoList" :key="i" @click="setSrc(video)">
      <div class="video">
        <iframe :src="video.videoHtml" width="350" height="210"></iframe>
      </div>
      <div class="description">
        <div class="title">{{video.title}}</div>
        <div class="name-container">
          <div class="name">{{video.name}}</div>

          <div class="view-count">조회수 {{video.viewCount}}</div>
          <div class="date"></div>
        </div>
        <div class="explanation">{{video.description}}</div>
      </div>
    </div>-->
  </div>
</template>

<style lang="scss" scoped>
@import "./main.scss";
</style>

<script src="./main.ts">
</script> 