<script setup>
import { defineProps, onMounted, onUnmounted } from "vue";

const props = defineProps({
  gameName: "circle",
});

let gameInstance = null;
const containerId = "game-container";
const game = (await import(`../games/${props?.gameName}/index.mjs`)).default;

onMounted(() => {
  gameInstance = new game("main-content");
});

onUnmounted(() => {
  gameInstance.destroy(false);
});
</script>

<template>
  <!-- <div :id="containerId" style="height: 100%; width: 100%" /> -->
</template>
