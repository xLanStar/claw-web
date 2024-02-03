<script setup>
import APIHelper from "@/helper/APIHelpr.mjs";
import { DRAW_LIST_URL } from "@/reference.mjs";
import { onMounted, ref } from "vue";

const draws = ref([]);

onMounted(() => {
  APIHelper.get(DRAW_LIST_URL).then((data) => (draws.value = data));
});
</script>
<template>
  <v-row v-for="({ dId, dName }, idx) of draws" :key="idx">
    <v-col>
      <v-card height="200" :to="{ name: 'DrawInfo', params: { dId } }">
        <template v-slot:text>
          <div class="d-flex justify-center">
            {{ dName }}
          </div>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>
