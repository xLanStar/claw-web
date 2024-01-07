import { createRouter, createWebHistory } from "vue-router";
import { Role } from "../data/role.mjs";
import { userState } from "../store/auth.mjs";

const routes = [
  {
    path: "/",
    name: "Layout",
    redirect: { name: "Home" },
    component: () => import("../views/Layout.vue"),
    meta: { auth: true },
    children: [
      {
        path: "/home",
        name: "Home",
        meta: {
          title: "首頁",
          auth: true,
          show: true,
          icon: "home",
        },
        component: () => import("../views/Home.vue"),
      },
      {
        path: "manage",
        name: "Manage",
        redirect: { name: "ManageSite" },
        meta: {
          title: "後台管理",
          auth: true,
          role: Role.Admin,
          show: true,
          icon: "manage",
        },
        component: () => import("../views/Manage.vue"),
        children: [
          {
            path: "site",
            name: "ManageSite",
            meta: { title: "場地管理", auth: true, icon: "place" },
            component: () => import("../views/ManageSite.vue"),
          },
          {
            path: "machine",
            name: "ManageMachine",
            meta: { title: "機台管理", auth: true },
            component: () => import("../views/ManageMachine.vue"),
          },
          {
            path: "shop",
            name: "ManageShop",
            meta: { title: "商店管理", auth: true, icon: "shop" },
            component: () => import("../views/ManageShop.vue"),
          },
          {
            path: "draw",
            name: "ManageDraw",
            meta: { title: "戳戳樂管理", auth: true },
            component: () => import("../views/ManageDraw.vue"),
          },
          {
            path: "claw",
            name: "ManageClaw",
            meta: { title: "夾娃娃管理", auth: true },
            component: () => import("../views/ManageClaw.vue"),
          },
          {
            path: "user/:uId?",
            name: "ManageUser",
            meta: {
              title: "會員管理",
              auth: true,
              role: Role.Root,
              icon: "person",
            },
            component: () => import("../views/ManageUser.vue"),
          },
        ],
      },
      {
        path: "claw",
        name: "Claw",
        meta: { title: "夾娃娃機", auth: true, show: true, icon: "" }, // TODO: icon
        component: () => import("../views/Claw.vue"),
      },
      {
        path: "draw",
        name: "Draw",
        meta: { title: "戳戳樂", auth: true, show: true, icon: "" }, // TODO: icon
        component: () => import("../views/Draw.vue"),
      },
      {
        path: "shop",
        name: "Shop",
        meta: { title: "商店", auth: true, show: true, icon: "store" },
        component: () => import("../views/Shop.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: { title: "登入" },
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    meta: { title: "註冊" },
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/:pathMatch(.*)",
    redirect: { name: "Home" },
    meta: { title: "雲端" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  console.log("[路由] ->", to.name, "頁面");

  // 權限不足，自動跳轉到上一頁
  if (to.meta.role && userState.value?.role < to.meta.role) return -1;

  // 必須要登入的介面，自動跳轉到登入頁面
  if (to.meta.auth && !userState.value) return { name: "Login" };

  // 如果要前往首頁，自動跳轉到自己的資料夾頁面
  // if (to.name === 'Box') return { name: 'Box-Folder' };

  // 跳轉登入頁面時，若已登入則跳轉到首頁
  if (!to.meta.auth && userState.value) return { name: "Home" };

  // 更新頁面標題
  window.document.title = to.meta.title
    ? to.meta.title + " - 遊子物語"
    : "遊子物語";
});

export default router;
