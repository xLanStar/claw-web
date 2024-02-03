<script setup>
import ManageCard from "@/components/ManageCard.vue";
import Table from "@/components/Table.vue";
import { InputType, useRule } from "@/data/form.mjs";
import { formatDateTime } from "@/utils/date.utils.mjs";
import { computed, onMounted, ref } from "vue";
import APIHelper from "../helper/APIHelpr.mjs";
import {
  MANAGE_MACHINE_LIST_URL,
  MANAGE_QRCODE_LIST_URL,
  MANAGE_QRCODE_URL,
} from "../reference.mjs";

const QRCodeColumns = computed(() => [
  {
    title: "機台",
    dataIndex: "mId",
    inputType: InputType.Select,
    inputProps: {
      items: machines.value,
      // inputProps: ({ label }) => ({ title: label }),
      rules: [useRule.required("機台名字")],
    },
  },
]);

const machines = ref([]);
const qrcodes = ref([]);
const addDialog = ref(false);

const onAddData = (data) =>
  APIHelper.post(MANAGE_QRCODE_URL, data)
    .then(fetchData)
    .then(() => {
      addDialog.value = false;
    });

const fetchData = async () =>
  (qrcodes.value = await APIHelper.get(MANAGE_QRCODE_LIST_URL));

onMounted(() => {
  fetchData();
  APIHelper.get(MANAGE_MACHINE_LIST_URL).then((data) => {
    machines.value = data.map((item) => ({
      title: item.mName,
      value: item.mId,
    }));
  });
});
</script>

<template>
  <Table :items="qrcodes" :columns="QRCodeColumns" :on-add-data="onAddData">
    <template v-slot="item">
      <manage-card
        link
        :to="{ name: 'ManageQRCodeInfo', params: { qrId: item.qrId } }"
        label="QRCode"
        :columns="QRCodeColumns"
        :data="item"
        :data-url="MANAGE_QRCODE_URL"
        primary-key="qrId"
        :items="{
          內容物數量: (item) => item.qrcodecontents?.length,
          啟用數量: (item) =>
            item.qrcodeitems.filter(({ qriEnable }) => qriEnable === true)
              .length,
          停用數量: (item) =>
            item.qrcodeitems.filter(({ qriEnable }) => qriEnable === false)
              .length,
          建立時間: (item) => formatDateTime(item.createdAt),
        }"
      >
        <template v-slot:title>
          {{ item.qrName || "(沒有名字)" }}
        </template>
      </manage-card>
    </template>
  </Table>
</template>
