<script setup>
import { alertState } from "../store/alert.mjs";

const ICON_MAP = {
  info: "info",
  success: "check",
  warning: "warning",
  error: "error",
};
</script>

<template>
  <v-alert
    v-for="{ icon, type, message } in alertState"
    :key="message"
    class="mt-4"
    position="fixed"
    location="top center"
    closable
    :icon="icon || ICON_MAP[type]"
    :text="message"
    rounded
    :type="type"
  />
</template>
