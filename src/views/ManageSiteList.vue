<script setup>
import Form from "@/components/Form.vue";
import { InputType } from "@/data/form.mjs";
import { mdiMagnify, mdiPlus } from "@mdi/js";
import { onMounted, ref } from "vue";
import { RoleColor, RoleName } from "../data/role.mjs";
import APIHelper from "../helper/APIHelpr.mjs";
import { MANAGE_SITE_LIST_URL } from "../reference.mjs";

const SiteColumns = [
  {
    title: "場地地址",
    dataIndex: "sAddress",
    inputType: InputType.Text,
  },
];

const sites = ref([]);
const search = ref("");
const addDialog = ref(false);

onMounted(
  async () => (sites.value = await APIHelper.get(MANAGE_SITE_LIST_URL))
);
</script>

<template>
  <v-data-iterator :items="sites" :items-per-page="12" :search="search">
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
        <v-dialog v-model="addDialog" persistent width="600">
          <template v-slot:activator="{ props }">
            <v-btn text="新增" :prepend-icon="mdiPlus" v-bind="props" />
          </template>
          <Form
            :columns="SiteColumns"
            diff-only
            @cancel="addDialog = false"
            :on-submit-success="() => (addDialog = false)"
          >
          </Form>
        </v-dialog>
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
              :to="{ name: 'ManageSiteInfo', params: { sId: item.raw.sId } }"
            >
              <template v-slot:title>
                <v-chip label :color="RoleColor[item.raw.uRole]">
                  {{ RoleName[item.raw.uRole] }}
                </v-chip>
                {{ item.raw.uName || "(沒有姓名)" }}
              </template>

              <template v-slot:subtitle>
                {{ item.raw.uEmail }}
              </template>

              <template v-slot:text>
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
