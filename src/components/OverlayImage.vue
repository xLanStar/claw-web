<script setup>
import { ref, watch } from "vue";
import { overlayImageState } from "../store/index.mjs";

const show = ref(false);

watch(overlayImageState, (value) => {
  show.value = !!value;
});
</script>
<template>
  <v-overlay
    v-model="show"
    class="align-center justify-center"
    width="100%"
    height="100%"
    close-on-content-click
  >
    <v-img :src="overlayImageState" contain class="h-100" />
  </v-overlay>
</template>
