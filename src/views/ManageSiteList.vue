<script setup>
import List from "@/components/List.vue";
import RoleChip from "@/components/RoleChip.vue";
import Table from "@/components/Table.vue";
import { InputType } from "@/data/form.mjs";
import { formatDateTime } from "@/utils/date.utils.mjs";
import { onMounted, ref } from "vue";
import APIHelper from "../helper/APIHelpr.mjs";
import { MANAGE_SITE_LIST_URL, MANAGE_SITE_URL } from "../reference.mjs";

const SiteAddColumns = [
  {
    title: "場地名字",
    dataIndex: "sName",
    inputType: InputType.Text,
  },
  {
    title: "場地地址",
    dataIndex: "sAddress",
    inputType: InputType.Text,
  },
];

const sites = ref([]);
const addDialog = ref(false);

const onAddData = (data) =>
  APIHelper.post(MANAGE_SITE_URL, data)
    .then(fetchData)
    .then(() => {
      addDialog.value = false;
    });

const fetchData = async () =>
  (sites.value = await APIHelper.get(MANAGE_SITE_LIST_URL));
onMounted(fetchData);
</script>

<template>
  <Table :items="sites" :columns="SiteAddColumns" :on-add-data="onAddData">
    <template v-slot="item">
      <v-card link :to="{ name: 'ManageSiteInfo', params: { sId: item.sId } }">
        <template v-slot:title>
          <v-chip label size="small">場地</v-chip>
          {{ item.sName || "(沒有名字)" }}
        </template>

        <template v-slot:text>
          <List
            :items="{
              ...(item?.user ? { 擁有者: item.user } : {}),
              場地地址: item.sAddress,
              建立時間: formatDateTime(item.createdAt),
            }"
          >
            <template v-slot:擁有者="{ value }">
              <role-chip :role="value?.uRole" />
              {{ value?.uEmail }}
            </template>
          </List>
        </template>
      </v-card>
    </template>
  </Table>
</template>
