import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {},
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "src/assets/scss/global";`,
      },
    },
  },
  build: {
    target: "esnext",
  },
});
