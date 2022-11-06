<template>
<div class="col">
  <div class="card-group">
  <div class="row gx-5" 
      v-for="(post, index) in posts"
      v-bind:key="index">
      <div class="col-md-6 mt-1 mb-2">
      <div data-mdb-ripple-color="light">
          <img class="img-fluid rounded" :src="getImageUrl(index)"/>
          <a href="#!">
          <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
          </a>
      </div>
      </div>
      <div class="col-md-6 mb-4">
        <span class="badge bg-danger px-2 py-1 shadow-1-strong mb-3">{{ post.tag.name }}</span>
        <h4><strong><router-link :to="'/posts/' + post.id">{{ post.title }}</router-link></strong></h4>
        <p class="text-muted text-justify">
            {{ post.description }}
        </p>
        <div class="row">
          <div class="col-sm-auto d-flex p-2 gap-1 ">
            <i class="bi bi-chat-dots"></i>
            <span>{{ post.commentCount }} 
              <span v-if="post.commentCount == 0">комментариев</span>
              <span v-if="post.commentCount == 1">комментарий</span>
              <span v-if="post.commentCount > 1 && post.commentCount <= 4">комментария</span>
              <span v-if="post.commentCount > 4">комментариев</span>
            </span>
          </div>
          <div class="col-sm-auto">
            <router-link :to="'/posts/' + post.id"><button type="button" class="btn btn-primary">Читать дальше</button></router-link>
          </div>
        </div>
      </div>
  </div>
  <br>
  </div>
</div> 
<div class="col">
    <PopularPostsVue/>
</div>
</template>

<script>
import PostDataService from "../services/PostDataService";
import PopularPostsVue from "./PopularPosts.vue";
import config from '../../vue.config';
const PATH = "/api/media/posts/"

export default {
  name: "posts-list",
  components: {
        PopularPostsVue,
    },
  data() {
    return {
      posts: [],
      title: ""
    };
  },
  methods: {
    getImageUrl(index) {
      return config.devServer.proxy + PATH + this.posts[index].image;
    },
    retrievePosts() {
        PostDataService.getAll()
        .then(response => {
          this.posts = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.retrievePosts();
  }
};
</script>

<style>
  .card-group{
    flex-wrap: nowrap;
    flex-direction: column;
  }
</style>