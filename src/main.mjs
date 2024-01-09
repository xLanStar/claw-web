// Vue
import App from "@/App.vue";
import { createApp } from "vue";

// Vuetify
import vuetify from "@/plugins/vuetify.mjs";

// Vue Router
import router from "@/router/index.mjs";

import "@/assets/scss/index.scss";
import { validate } from "@/utils/auth.utils.mjs";

// 驗證
await validate();

// Vue App
const app = createApp(App);
app.use(vuetify);
app.use(router);
app.mount("#app");
