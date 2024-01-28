<script setup>
import { defineProps } from "vue";
import GameWindow from "./GameWindow.vue";

const props = defineProps({
  gameName: "circle",
});
</script>

<template>
  <suspense>
    <GameWindow v-bind="props" />
    <template #fallback>
      <v-card title="讀取中..." />
    </template>
  </suspense>
</template>
