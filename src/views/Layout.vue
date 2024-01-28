<script setup>
import { mdiHome } from "@mdi/js";
import { useRouter } from "vue-router";
import { userState } from "../store/auth.mjs";

const router = useRouter();

const flatRoutes = (list, originList = [list]) => {
  for (const { children } of list) {
    if (children) {
      originList.push(children);
      flatRoutes(children, originList);
    }
  }
  return list === originList[0] ? originList.flat() : undefined;
};
</script>

<template>
  <v-main>
    <v-container id="main-content" style="height: 100%">
      <router-view />
    </v-container>
  </v-main>
  <v-bottom-navigation mode="shift">
    <template v-for="{ name, meta } in flatRoutes(router.options.routes)">
      <v-btn
        v-if="
          meta?.show && (meta?.role ? userState?.uRole >= meta?.role : true)
        "
        :value="name"
        :to="{ name }"
      >
        <v-icon :icon="meta?.icon" />
        <span>{{ meta?.title }}</span>
      </v-btn>
    </template>
    <!-- <v-btn value="Home" :to="{ name: 'Home' }">
      <v-icon :icon="mdiHome" />
      <span>HOME</span>
    </v-btn> -->
  </v-bottom-navigation>
</template>
