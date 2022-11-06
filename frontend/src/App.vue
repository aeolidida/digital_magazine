<template>
  <div class="container">
  <header class="p-3 mb-3 border-bottom mt-1">
      <div class="container">
          <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <span class="h2 "><router-link class="text-decoration-none" to="/">Кинза</router-link></span>
            <ul v-if="currentUser" class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 px-3">
                <li><router-link class="text-decoration-none" to="/add"><span class="nav-link px-2 link-dark">+ Добавить статью</span></router-link></li>
            </ul>
            <div class="dropdown text-end" v-if="currentUser">
                <a href="#" class="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                {{ currentUser.username }}
                </a>
                <ul class="dropdown-menu text-small" aria-labelledby="dropdownUser1"> 
                    <li class="dropdown-item">
                        <router-link to="/profile">Профиль</router-link>
                    </li >
                    <li class="dropdown-item"><a class="nav-link" href @click.prevent="logOut">Выйти</a></li>
                </ul>   
            </div>
            <div class="text-end" v-if="!currentUser">
                <router-link to="/login"><span class="btn btn-outline-primary me-2">Войти</span></router-link>
                <router-link to="/signup"><span class="btn btn-primary">Зарегистрироваться</span></router-link>
            </div>
          </div>
      </div>
  </header>
  </div>
  <div class="container">
    <div class="row">
      <router-view :key='$route.fullPath' />
    </div>
  </div>  
  <footer class="text-center text-lg-start bg-light text-muted">
    <div class="text-center p-4" style="background-color: rgba(0, 0, 0, 0.05);">
      © 2022 Copyright:
      <a class="text-reset fw-bold" href="">kinza.com</a>
    </div>
  </footer>
</template>

<script>
import EventBus from "../common/EventBus";

export default {
  name: "app",
  computed: {
      currentUser() {
        return this.$store.state.auth.user;
      }
    },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  },
  mounted() {
    EventBus.on("logout", () => {
      this.logOut();
    });
  },
  beforeUnmount() {
    EventBus.remove("logout");
  }
};
</script>

<style>
  body {
    min-height: 100vh;
  }

  #app{
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  #app div:nth-child(2){
    flex: 1 1 0;
  }
  #app div:nth-child(2) .row .col:nth-child(2){
    flex: 0 0 0;
  }
</style>