<script setup>
import { mdiAlert, mdiCheck, mdiInformation } from "@mdi/js";
import { alertState } from "../store/alert.mjs";

const ICON_MAP = {
  info: mdiInformation,
  success: mdiCheck,
  warning: mdiAlert,
  error: mdiAlert,
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
