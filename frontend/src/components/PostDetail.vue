<template>
    <div class="col mb-4" v-if="currentPost">
    <div class="post-entry" >
        <h2>{{ currentPost.title }}</h2>
        <p>опубликовано {{ currentPost.user.username }} {{ currentPost.createdAtString }} </p>
        <div class="mb-3">
            <img class="rounded mx-auto d-block" :src="getImageUrl()">
        </div>
        <div v-html="currentPost.content"></div>
    </div>
    <div v-if="currentPost.user.username == currentUser?.username || isCurrentUserAdminOrModerator" class="d-flex gap-3">
        <button type="button" class="btn btn-primary"><router-link class="text-white text-decoration-none" :to="'/posts/' + currentPost.id +'/edit'">Редактировать</router-link></button>
        <button type="button" class="btn btn-primary" v-on:click="this.launchDeleteModal()">Удалить</button>
    </div>

    <hr>
    <h4>Комментарии</h4>
    <div  v-for="(comment, index) in currentPost.comments"
            v-bind:key="index">
      <p>{{ comment.user.username }} &middot; {{ comment.text }}</p>
    </div>
    <hr>
    <div v-if="currentUser">
    <h4>Добавить комментарий</h4>
    <Form @submit="handleAddComment" :validation-schema="schema">        
      <div class="form-group mb-3"> 
        <label for="comment">Комментарий </label> 
        <Field name="comment" type="text" class="form-control" as="textarea"/>
        <ErrorMessage name="comment" class="error-feedback" />
      </div>
      <button class="btn btn-success ml-2" type="submit">Добавить комментарий</button>
    </Form>
    </div>
    </div> 

  <div class="col">
    <PopularPostsVue/>
  </div>

  <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Удаление поста</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Вы уверены, что хотите удалить этот пост?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
          <button type="button" class="btn btn-primary" @click="this.handleDeletePost()">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import PostDataService from "../services/PostDataService";
import CommentDataService from "../services/CommentDataService";
import PopularPostsVue from "./PopularPosts.vue";
import datePrettify from "../services/datePrettify";
import { Modal } from 'bootstrap'
import config from '../../vue.config';
const PATH = "/api/media/posts/"

export default {
  name: "current-post",
  components: {
        Form,
        Field,
        ErrorMessage,
        PopularPostsVue,
    },
  data() {
    const schema = yup.object().shape({
        comment: yup
            .string()
            .required("Коментарий не может быть пустым!")
            .min(3, "Коментарий должен содержать минимум 3 символа!")
            .max(255, "Коментарий не должен превышать 255 символов!"),
      });
    return {
        dataReady: false,
        currentPost: null,
        modal: null,
        message: '',
        schema,
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    isCurrentUserAdminOrModerator() {
      const user = this.$store.state.auth.user;
      if(!user){
        return false;
      }
      for (let i = 0; i < user.roles.length; i++){
        if (user.roles[i] == "ROLE_ADMIN" || user.roles[i] == "ROLE_MODERATOR" ){
          return true;
        }
      }

      return false;
    }
  },
  methods: {
    getImageUrl() {
      return config.devServer.proxy + PATH + this.currentPost.image;
    },
    getPost(id) {
      PostDataService.get(id)
      .then(response => {
        this.currentPost = response.data;
        this.currentPost.createdAtString = datePrettify(new Date(this.currentPost.createdAt));
      })
      .catch(e => {
        console.log(e);
      });
    },
    handleAddComment(comment, { resetForm }) {
      let data = {
          text: comment.comment,
          postId: this.currentPost.id,
      }
      this.message = "";
      this.successful = false;
      this.loading = true;

      CommentDataService.create(data)
          .then(response => {
              this.id = response.data.id;
              this.message = "Комментарий добавлен!";
              this.successful = true;
              this.loading = false;
              console.log(response.data);
              this.getPost(this.$route.params.id);
              resetForm()
          })
          .catch(error => {
              this.message =
                  (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                  error.message ||
                  error.toString();
              this.successful = false;
              this.loading = false;
              console.log(error);
          });
    },
    launchDeleteModal(){
      this.modal = new Modal(document.getElementById('deleteModal'));
      this.modal.show();
    },
    handleDeletePost(){
      this.modal.hide();
      PostDataService.delete(this.currentPost.id)
        .then(() => {
          this.$router.push("/");
        }).catch(e => {
          console.log(e);
        });
    }
  },
  created() {
    this.message = '';
    this.getPost(this.$route.params.id);
    this.dataReady = true;
  }
};
</script>
