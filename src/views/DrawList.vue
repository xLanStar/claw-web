<script setup>
import APIHelper from "@/helper/APIHelpr.mjs";
import { DRAW_LIST_URL } from "@/reference.mjs";
import { userState } from "@/store/auth.mjs";
import { mdiBitcoin } from "@mdi/js";
import { onMounted, ref } from "vue";

const draws = ref([]);

onMounted(() => {
  APIHelper.get(DRAW_LIST_URL).then((data) => (draws.value = data));
});
</script>
<template>
  <v-row>
    <v-col>
      <div align="center">
        您持有
        <v-icon :icon="mdiBitcoin" />
        x
        {{
          userState?.usertokens?.reduce(
            (acc, { utAmount }) => acc + utAmount,
            0
          )
        }}
      </div>
    </v-col>
  </v-row>
  <v-row v-for="({ dId, dName, dCost }, idx) of draws" :key="idx">
    <v-col>
      <v-card height="200" :to="{ name: 'DrawInfo', params: { dId } }">
        <template v-slot:title>
          <div align="center" class="text-h5">
            {{ dName }}
          </div>
        </template>
        <template v-slot:text>
          <div align="center" class="text-h6">
            抽一次 <v-icon :icon="mdiBitcoin" /> x {{ dCost }}
          </div>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>
