<template>

<div class="card" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">Тренды</h5>
      <p class="card-text">Самое популярное за последнее время:</p>
    </div>
    <div class="list-group">
      <div v-for="(popularPost, index) in popularPosts"
      v-bind:key="index">
        <span class="list-group-item list-group-item-action"><router-link :to="'/posts/' + popularPost.id">{{ popularPost.title }}</router-link></span>
      </div>
    </div>
  </div>
</template>

<script>
import PostDataService from "../services/PostDataService";

export default {
  name: "popular-posts",
  data() {
    return {
        popularPosts: [],
    };
  },
  methods: {
    retrievePopularPosts() {
        PostDataService.getFivePopular()
        .then(response => {
          this.popularPosts = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
  },
  created() {
    this.retrievePopularPosts();
  }
};
</script>
