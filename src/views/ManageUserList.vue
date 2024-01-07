<script setup>
import { mdiMagnify } from "@mdi/js";
import { onMounted, ref } from "vue";
import { RoleColor, RoleName } from "../data/role.mjs";
import APIHelper from "../helper/APIHelpr.mjs";
import { MANAGE_USER_LIST_URL } from "../reference.mjs";

const users = ref([]);
const search = ref("");

onMounted(
  async () => (users.value = await APIHelper.get(MANAGE_USER_LIST_URL))
);
</script>

<template>
  <v-data-iterator :items="users" :items-per-page="12" :search="search">
    <template v-slot:header>
      <v-toolbar class="px-2">
        <v-toolbar-title>
          <v-text-field
            v-model="search"
            density="comfortable"
            hide-details
            placeholder="搜尋"
            :prepend-inner-icon="mdiMagnify"
            style="max-width: 300px"
            variant="solo"
          />
        </v-toolbar-title>
      </v-toolbar>
    </template>

    <template v-slot:default="{ items }">
      <v-container class="pa-0" fluid>
        <v-row dense>
          <v-col
            v-for="(item, i) in items"
            :key="i"
            cols="12"
            md="6"
            lg="4"
            xl="3"
          >
            <v-card
              link
              :to="{ name: 'ManageUserInfo', params: { uId: item.raw.uId } }"
            >
              <template v-slot:title>
                <v-chip label :color="RoleColor[item.raw.uRole]">
                  {{ RoleName[item.raw.uRole] }}
                </v-chip>
                {{ item.raw.uId }}
              </template>

              <template v-slot:subtitle>
                {{ item.raw.uEmail }}
              </template>

              <template v-slot:text>
                {{ item.raw.uName || "(沒有姓名)" }}
                {{ item.raw.uPhoneNumber || "(沒有電話號碼)" }}
                <br />
                {{ item.raw.uAddress || "(沒有地址)" }}
              </template>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template v-slot:footer="{ page, pageCount }">
      <v-pagination :model-value="page" :length="pageCount"></v-pagination>
    </template>
  </v-data-iterator>
</template>
