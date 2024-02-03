import Claw from "@/views/Claw.vue";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Scan from "@/views/Scan.vue";
import Shop from "@/views/Shop.vue";
import {
  mdiAccount,
  mdiCheckerboard,
  mdiHome,
  mdiListBox,
  mdiMapMarker,
  mdiNotebook,
  mdiQrcode,
  mdiRobotIndustrial,
  mdiStore,
} from "@mdi/js";
import { createRouter, createWebHistory } from "vue-router";
import { Role } from "../data/role.mjs";
import { userState } from "../store/auth.mjs";

const routes = [
  {
    path: "/",
    name: "Layout",
    redirect: { name: "Home" },
    component: () => import("@/views/Layout.vue"),
    meta: { auth: true },
    children: [
      {
        path: "home",
        name: "Home",
        meta: {
          title: "首頁",
          auth: true,
          show: true,
          icon: mdiHome,
        },
        component: Home,
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
          icon: mdiNotebook,
        },
        component: () => import("@/views/Manage.vue"),
        children: [
          {
            path: "site",
            name: "ManageSite",
            redirect: { name: "ManageSiteList" },
            meta: { title: "場地管理", auth: true, icon: mdiMapMarker },
            children: [
              {
                path: "",
                name: "ManageSiteList",
                component: () => import("@/views/ManageSiteList.vue"),
                meta: {
                  title: "場地列表",
                },
              },
              {
                path: ":sId",
                name: "ManageSiteInfo",
                component: () => import("@/views/ManageSiteInfo.vue"),
                meta: {
                  title: "場地詳細資訊",
                },
              },
            ],
          },
          {
            path: "machine",
            name: "ManageMachine",
            redirect: { name: "ManageMachineList" },
            meta: { title: "機台管理", auth: true, icon: mdiListBox },
            // component: () => import("@/views/ManageMachine.vue"),
            children: [
              {
                path: "",
                name: "ManageMachineList",
                component: () => import("@/views/ManageMachineList.vue"),
                meta: {
                  title: "機台列表",
                },
              },
              {
                path: ":mId",
                name: "ManageMachineInfo",
                component: () => import("@/views/ManageMachineInfo.vue"),
                meta: {
                  title: "機台詳細資訊",
                },
              },
            ],
          },
          {
            path: "qrcode",
            name: "ManageQRCode",
            redirect: { name: "ManageQRCodeList" },
            meta: { title: "QRCode管理", auth: true, icon: mdiQrcode },
            // component: () => import("@/views/ManageQRCode.vue"),
            children: [
              {
                path: "",
                name: "ManageQRCodeList",
                component: () => import("@/views/ManageQRCodeList.vue"),
                meta: {
                  title: "QRCode列表",
                },
              },
              {
                path: ":qrId",
                name: "ManageQRCodeInfo",
                component: () => import("@/views/ManageQRCodeInfo.vue"),
                meta: {
                  title: "QRCode詳細資訊",
                },
              },
            ],
          },
          {
            path: "draw",
            name: "ManageDraw",
            meta: { title: "抽獎管理", auth: true, icon: mdiCheckerboard },
            redirect: { name: "ManageDrawList" },
            // component: () => import("@/views/ManageDraw.vue"),
            children: [
              {
                path: "",
                name: "ManageDrawList",
                component: () => import("@/views/ManageDrawList.vue"),
                meta: {
                  title: "抽獎列表",
                },
              },
              {
                path: ":dId",
                name: "ManageDrawInfo",
                component: () => import("@/views/ManageDrawInfo.vue"),
                meta: {
                  title: "抽獎詳細資訊",
                },
              },
            ],
          },
          {
            path: "claw",
            name: "ManageClaw",
            meta: { title: "夾娃娃管理", auth: true, icon: mdiRobotIndustrial },
            component: () => import("@/views/ManageClaw.vue"),
          },
          {
            path: "shop",
            name: "ManageShop",
            meta: { title: "商店管理", auth: true, icon: mdiStore },
            component: () => import("@/views/ManageShop.vue"),
          },
          {
            path: "user",
            name: "ManageUser",
            redirect: { name: "ManageUserList" },
            meta: {
              title: "會員管理",
              auth: true,
              role: Role.Root,
              icon: mdiAccount,
            },
            children: [
              {
                path: "",
                name: "ManageUserList",
                component: () => import("@/views/ManageUserList.vue"),
                meta: {
                  title: "會員列表",
                },
              },
              {
                path: ":uId",
                name: "ManageUserInfo",
                component: () => import("@/views/ManageUserInfo.vue"),
                meta: {
                  title: "會員詳細資訊",
                },
              },
            ],
          },
        ],
      },
      {
        path: "claw",
        name: "Claw",
        meta: {
          title: "夾娃娃機",
          auth: true,
          show: true,
          icon: mdiRobotIndustrial,
        },
        component: Claw,
      },
      {
        path: "draw",
        name: "Draw",
        meta: {
          title: "抽獎",
          auth: true,
          show: true,
          icon: mdiCheckerboard,
        },
        redirect: { name: "DrawList" },
        // component: () => import("@/views/ManageDraw.vue"),
        children: [
          {
            path: "",
            name: "DrawList",
            component: () => import("@/views/DrawList.vue"),
            meta: {
              title: "抽獎列表",
            },
          },
          {
            path: ":dId",
            name: "DrawInfo",
            component: () => import("@/views/DrawInfo.vue"),
            meta: {
              title: "抽獎",
            },
          },
        ],
      },
      {
        path: "shop",
        name: "Shop",
        meta: { title: "商店", auth: true, show: true, icon: mdiStore },
        component: Shop,
      },
      {
        path: "scan",
        name: "Scan",
        meta: { title: "掃描", auth: true, show: false },
        component: Scan,
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: { title: "登入" },
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    meta: { title: "註冊" },
    component: Register,
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
    ? to.meta.title + " - 遊子選物販賣"
    : "遊子選物販賣";
});

export default router;
