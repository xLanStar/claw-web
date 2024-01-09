<script setup>
import RoleChip from "@/components/RoleChip.vue";
import Table from "@/components/Table.vue";
import { InputType } from "@/data/form.mjs";
import { Role } from "@/data/role.mjs";
import { userState } from "@/store/auth.mjs";
import { onMounted, ref } from "vue";
import APIHelper from "../helper/APIHelpr.mjs";
import { MANAGE_SITE_LIST_URL, MANAGE_SITE_URL } from "../reference.mjs";

const SiteColumns = [
  {
    title: "場地地址",
    dataIndex: "sAddress",
    inputType: InputType.Text,
  },
];

const sites = ref([]);
const addDialog = ref(false);

const onAddData = (data) =>
  APIHelper.post(MANAGE_SITE_URL, {
    sAddress: data.sAddress,
  }).then((data) => {
    sites.value.push(data);
    addDialog.value = false;
  });

onMounted(
  async () => (sites.value = await APIHelper.get(MANAGE_SITE_LIST_URL))
);
</script>

<template>
  <Table :items="sites" :columns="SiteColumns" :on-add-data="onAddData">
    <template v-slot="item">
      <v-card link :to="{ name: 'ManageSiteInfo', params: { sId: item.sId } }">
        <template v-slot:title>
          <v-chip label>場地</v-chip>
          {{ item.sAddress }}
        </template>

        <template v-slot:subtitle>
          {{ item.sId }}
        </template>

        <template v-if="userState.uRole === Role.Root" v-slot:text>
          擁有者：
          <RoleChip :role="item?.user?.uRole || '未知'" />
          {{ item.uId }}
        </template>
      </v-card>
    </template>
  </Table>
</template>
