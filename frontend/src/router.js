import { createWebHistory, createRouter } from "vue-router";
import ifAuthenticated from './middleware/authentication'

const routes =  [
  {
    path: "/",
    name: "posts",
    component: () => import("./components/PostList")
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./components/Login")
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("./components/Signup")
  },
  {
    path: '/profile',
    name: 'profile',
    beforeEnter: ifAuthenticated,
    component: () => import('./components/Profile.vue')
  },
  {
    path: "/posts/:id",
    name: "post-detail",
    component: () => import("./components/PostDetail")
  },
  {
    path: "/add",
    name: "add",
    beforeEnter: ifAuthenticated,
    component: () => import("./components/AddPost")
  },
  {
    path: "/posts/:id/edit",
    name: "edit",
    beforeEnter: ifAuthenticated,
    component: () => import("./components/EditPost")
  }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;