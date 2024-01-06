// Vue
import { createApp } from "vue";
import App from "./App.vue";

// Vuetify
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, md } from "vuetify/iconsets/md";
import "vuetify/styles";

import "material-design-icons-iconfont/dist/material-design-icons.css";

import "./assets/scss/index.scss";
import router from "./router/index.mjs";
import { validate } from "./utils/auth.utils.mjs";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "md",
    aliases,
    sets: {
      md,
    },
  },
  theme: {
    defaultTheme: localStorage.getItem("theme") || "light",
  },
  defaults: {
    VCard: {
      variant: "tonal",
    },
  },
});

// 驗證
await validate();

// Vue App
const app = createApp(App);
app.use(vuetify);
app.use(router);
app.mount("#app");
