<template>
    <div class="container">
      <header class="jumbotron">
        <h3>
          Профиль
        </h3>
      </header>
      <p>
        <strong>Имя:</strong>
        {{currentUser.username}}
      </p>
      <p>
        <strong>Id:</strong>
        {{currentUser.id}}
      </p>
      <p>
        <strong>Email:</strong>
        {{currentUser.email}}
      </p>
      <strong>Права:</strong>
      <ul>
        <li v-for="(role,index) in currentUser.roles" :key="index">{{ prettify(role) }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  import rolePrettify from "../services/rolePrettify";


  export default {
    name: 'Profile',
    computed: {
      currentUser() {
        return this.$store.state.auth.user;
      }
    },
    methods: {
      prettify(role) {
        return rolePrettify(role)
      },
    },
    mounted() {
      if (!this.currentUser) {
        this.$router.push('/login');
      }
    }
  };
  </script>