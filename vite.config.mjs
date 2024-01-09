import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {},
  plugins: [vue()],
  css: {
    transformer: "lightningcss",
  },
  build: {
    target: "esnext",
  },
  resolve: {
    alias: {
      "@": "/src",
    },
    extensions: [],
  },
});
