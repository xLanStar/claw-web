<script setup>
import List from "@/components/List.vue";
import RoleChip from "@/components/RoleChip.vue";
import Table from "@/components/Table.vue";
import { InputType, useRule } from "@/data/form.mjs";
import { formatDateTime } from "@/utils/date.utils.mjs";
import { onMounted, ref } from "vue";
import APIHelper from "../helper/APIHelpr.mjs";
import {
  MANAGE_MACHINE_LIST_URL,
  MANAGE_MACHINE_URL,
  MANAGE_SITE_LIST_URL,
} from "../reference.mjs";

const MachineAddColumns = [
  {
    title: "機台名字",
    dataIndex: "mName",
    inputType: InputType.Text,
    inputProps: {
      rules: [useRule.required("機台名字")],
    },
  },
];

const sites = ref([]);
const machines = ref([]);
const addDialog = ref(false);

const onAddData = (data) =>
  APIHelper.post(MANAGE_MACHINE_URL, data)
    .then(fetchData)
    .then(() => {
      addDialog.value = false;
    });

const fetchData = async () => {
  machines.value = await APIHelper.get(MANAGE_MACHINE_LIST_URL);
  sites.value = await APIHelper.get(MANAGE_SITE_LIST_URL);
};
onMounted(fetchData);
</script>

<template>
  <Table
    :items="machines"
    :columns="MachineAddColumns"
    :on-add-data="onAddData"
  >
    <template v-slot="item">
      <v-card
        link
        :to="{ name: 'ManageMachineInfo', params: { mId: item.mId } }"
      >
        <template v-slot:title>
          <v-chip label size="small">機台</v-chip>
          {{ item.mName || "(沒有名字)" }}
        </template>

        <!-- <template v-slot:subtitle>
          {{ item.sAddress }}
        </template> -->

        <template v-slot:text>
          <List
            :items="{
              ...(item?.user ? { 擁有者: item.user } : {}),
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
