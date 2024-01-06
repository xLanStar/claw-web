<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { userState } from "../store/auth.mjs";

const route = useRoute();

const tab = ref();

console.log();
</script>

<template>
  <v-card>
    <v-tabs v-model="tab" align-tabs="center" centered stacked>
      <template v-for="{ name, meta } in route.matched[1].children" :key="name">
        <v-tab
          v-if="!meta.role || userState.uRole >= meta.role"
          :value="name"
          :to="{ name }"
        >
          <v-icon :icon="meta.icon" />
          {{ meta.title }}
        </v-tab>
      </template>
    </v-tabs>

    <v-card-text>
      <router-view />
    </v-card-text>
  </v-card>
</template>
