<script setup>
import Alert from "./components/Alert.vue";
import Loading from "./components/Loading.vue";
import OverlayImage from "./components/OverlayImage.vue";
</script>

<template>
  <v-app id="v-app">
    <router-view />
    <Loading />
    <Alert />
  </v-app>
</template>
