<template>        
    <h1>Редактировать статью</h1>
    <Form @submit="handleEditPost" :validation-schema="schema" enctype="multipart/form-data" v-if="currentPost">
    
    <div class="form-group mb-3">
        <label for="title">Заголовок</label> 
        <Field name="title" type="text" class="form-control"  v-model="currentPost.title" />
        <ErrorMessage name="title" class="error-feedback" />
    </div> 
    <div class="form-group mb-3">
        <label for="description">Краткое описание</label> 
        <Field name="description" type="text" class="form-control" as="textarea" v-model="currentPost.description"/>
        <ErrorMessage name="description" class="error-feedback" />
    </div> 
    <div class="form-group mb-3">
        <label for="content">Текст</label> 
        <Field name="content" type="text" class="form-control" id="content" v-model="currentPost.content" v-slot="{field}">
            <editor v-model="currentPost.content" v-bind="field"
                :init="{
                menubar: false,
                statusbar: false,
                plugins: 'lists link emoticons',
                toolbar: 'undo redo | styleselect fontsizeselect | forecolor backcolor | bold italic underline strikethrough | bullist numlist | link image emoticons'
                }"
            />
        </Field>
        <ErrorMessage name="content" class="error-feedback" />
    </div> 
    <div class="form-group mb-3">
        <label for="tag">Тег</label> 
        <Field name="tag" class="form-control" as="select" v-model="currentPost.tag.id">
            <option v-for="tag in tags" :key="tag" :value="tag.id">{{ tag.name }}</option>
        </Field>
        <ErrorMessage name="tag" class="error-feedback" />
    </div> 
    
    <div class="form-group mb-3"> 
        <label for="image">Изображение</label> 
        <div class="mb-2"> 
        <Field type="file" name="image" class="form-control" accept="image/*" id="id_image_field" @change="onFileChange"/>
        <ErrorMessage name="image" class="error-feedback" />
        </div>
    
        <div>Превью</div>
        <div id="preview">
            <img v-if="url" :src="url" />
        </div>
    </div>
    <div class="form-group mb-3"> 
        <button class="btn btn-success ml-2" :disabled="loading">
            <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
            ></span>
            Сохранить пост
            </button>
    </div>
    </Form>
    <div
            v-if="message"
            class="alert"
            :class="successful ? 'alert-success' : 'alert-danger'"
        >
            {{ message }}
        </div>
    <br>    
    </template>
    
    <script>
    import { Form, Field, ErrorMessage } from "vee-validate";
    import * as yup from "yup";
    import PostDataService from "../services/PostDataService";
    import TagDataService from "../services/TagDataService";
    import EventBus from "../../common/EventBus";
    import Editor from '@tinymce/tinymce-vue';
    import config from '../../vue.config';
    const PATH = "/api/media/posts/"

    export default {
        name: "AddPost",
        components: {
            Form,
            Field,
            ErrorMessage,
            "editor" : Editor
        },
        data() {
          const schema = yup.object().shape({
            title: yup
                .string()
                .required("Заголовок обязателен!")
                .min(3, "Заголовок должен содержать минимум 3 символа!")
                .max(255, "Заголовок не должен превышать 255 символов!"),
            description: yup
                .string()
                .required("Описание обязательно!")
                .min(3, "Описание должно содержать минимум 3 символа!")
                .max(255, "Описание не должно превышать 255 символов!"),
            content: yup
                .string()
                .required("Текст поста обязателен!")
                .min(10, "Текст должен содержать минимум 10 символов!"),
            tag: yup
                .number()
                .required('Тег обязателен!'),
            image: yup
                .mixed()
          });
          return {
            currentPost: null,
            tags: [],
            url: null,
            successful: false,
            loading: false,
            message: "",
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
            retrieveTags() {
                TagDataService.getAll()
                    .then(response => {
                        this.tags = response.data;
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            getPost(id) {
                PostDataService.get(id)
                .then(response => {
                    if ((response.data.user.id != this.currentUser?.id) && !this.isCurrentUserAdminOrModerator){
                        this.$router.push(`/posts/${response.data.id}`);
                    }
                    this.currentPost = response.data;
                    this.url = this.getImageUrl(this.currentPost.image);
                })
                .catch(e => {
                    console.log(e);
                });
            },
            handleEditPost(post) {
                let data = {
                    title: post.title,
                    description: post.description,
                    content: post.content,
                    tagId: post.tag,
                    image: post.image
                }
                this.message = "";
                this.successful = false;
                this.loading = true;
    
                PostDataService.update(this.currentPost.id, data)
                    .then(response => {
                        this.id = response.data.id;
                        this.message = "Статья обновлена!";
                        this.successful = true;
                        this.loading = false;
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
    
                        if (error.response && error.response.status === 401) {
                            EventBus.dispatch("logout");
                        }
                    });
            },
            onFileChange(e) {
                const file = e.target.files[0];
                this.url = URL.createObjectURL(file);
            }
        },
        created() {
            this.getPost(this.$route.params.id);
            this.retrieveTags();    
        }
      };
    </script>

<style>
.tox-sidebar {
    display: none !important;
}
</style>