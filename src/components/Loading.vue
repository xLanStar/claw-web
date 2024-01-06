<script setup>
import { loadingState } from "../store/index.mjs";
</script>

<template>
  <v-overlay :model-value="loadingState" class="align-center justify-center">
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
</template>
