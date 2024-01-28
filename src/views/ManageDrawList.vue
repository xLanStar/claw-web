<script setup>
import List from "@/components/List.vue";
import RoleChip from "@/components/RoleChip.vue";
import Table from "@/components/Table.vue";
import { InputType, useRule } from "@/data/form.mjs";
import { formatDateTime } from "@/utils/date.utils.mjs";
import { onMounted, ref } from "vue";
import APIHelper from "../helper/APIHelpr.mjs";
import { MANAGE_DRAW_LIST_URL, MANAGE_DRAW_URL } from "../reference.mjs";

const DrawAddColumns = [
  {
    title: "戳戳樂名稱",
    dataIndex: "dName",
    inputType: InputType.Text,
  },
  {
    title: "戳戳樂洞數（0~3000）",
    dataIndex: "dHoleCount",
    inputType: InputType.Number,
    inputProps: {
      rules: [
        useRule.min("戳戳樂洞數", 0),
        useRule.max("戳戳樂洞數", 3000),
        useRule.integer("戳戳樂洞數"),
      ],
    },
  },
];

const draws = ref([]);
const addDialog = ref(false);

const onAddData = (data) =>
  APIHelper.post(MANAGE_DRAW_URL, data)
    .then(fetchData)
    .then(() => {
      addDialog.value = false;
    });

const fetchData = async () =>
  (draws.value = await APIHelper.get(MANAGE_DRAW_LIST_URL));

onMounted(fetchData);
</script>

<template>
  <Table :items="draws" :columns="DrawAddColumns" :on-add-data="onAddData">
    <template v-slot="item">
      <v-card link :to="{ name: 'ManageDrawInfo', params: { dId: item.dId } }">
        <template v-slot:title>
          <v-chip label size="small">戳戳樂</v-chip>
          {{ item.dName || "(沒有名字)" }}
        </template>

        <template v-slot:text>
          <List
            :items="{
              ...(item?.user ? { 擁有者: item.user } : {}),
              洞數: item?.dHoleCount,
              剩餘洞數: item?.dHoleLeft,
              剩餘獎項: item?.dPrizeLeft,
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
