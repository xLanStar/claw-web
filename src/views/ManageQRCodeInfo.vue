<script setup>
import ManageCard from "@/components/ManageCard.vue";
import RoleChip from "@/components/RoleChip.vue";
import Table from "@/components/Table.vue";
import { InputType, useRule } from "@/data/form.mjs";
import {
  QRCodeContentTypeNameMap,
  QRCodeContentTypeOptions,
} from "@/data/qrcodecontent.mjs";
import { formatDateTime } from "@/utils/date.utils.mjs";
import { mdiAlertCircle, mdiArrowLeft, mdiCheck, mdiClose } from "@mdi/js";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import APIHelper from "../helper/APIHelpr.mjs";
import {
  MANAGE_MACHINE_LIST_URL,
  MANAGE_QRCODECONTENT_URL,
  MANAGE_QRCODEITEM_URL,
  MANAGE_QRCODE_URL,
} from "../reference.mjs";

const router = useRouter();
const route = useRoute();

const machines = ref([]);
const qrcode = ref({});
const qrcodeTooltips = computed(() => null);

const QRCodeColumns = computed(() => [
  {
    title: "所屬機台",
    dataIndex: "mId",
    inputType: InputType.Select,
    inputProps: {
      items: machines.value,
      // inputProps: ({ label }) => ({ title: label }),
      rules: [useRule.required("機台名字")],
    },
  },
]);

const QRCodeContentColumns = computed(() => [
  {
    title: "類型",
    dataIndex: "qrcType",
    inputType: InputType.Select,
    inputProps: {
      items: QRCodeContentTypeOptions,
      rules: [
        useRule.required("類型"),
        // (value) =>
        //   qrcode.value.qrcodecontents.some(({ qrcType }) => qrcType === value)
        //     ? "類型重複"
        //     : true,
      ],
    },
  },
  {
    title: "數量",
    dataIndex: "qrcCount",
    inputType: InputType.Number,
    inputProps: {
      rules: [
        useRule.min("數量", 1),
        useRule.max("數量", 100),
        useRule.required("類型"),
      ],
    },
  },
]);

const QRCodeItemColumns = [
  {
    title: "數量",
    dataIndex: "count",
    inputType: InputType.Number,
    inputProps: {
      rules: [
        useRule.min("數量", 1),
        useRule.max("數量", 100),
        useRule.required("類型"),
      ],
    },
  },
];

const submitAddQRCodeContent = (data) =>
  APIHelper.post(MANAGE_QRCODECONTENT_URL, {
    ...data,
    qrId: route.params.qrId,
  }).then((data) => qrcode.value.qrcodecontents?.push(data));

const submitAddQRCodeItem = (data) =>
  APIHelper.post(MANAGE_QRCODEITEM_URL, {
    ...data,
    qrId: route.params.qrId,
  }).then((data) => qrcode.value.qrcodeitems?.push(...data));

onMounted(() => {
  APIHelper.get(`${MANAGE_QRCODE_URL}/${route.params.qrId}`).then(
    (data) => (qrcode.value = data)
  );
  APIHelper.get(MANAGE_MACHINE_LIST_URL).then((data) => {
    machines.value = data.map((item) => ({
      title: item.mName,
      value: item.mId,
    }));
  });
});
</script>

<template>
  <v-row>
    <v-col>
      <v-btn :icon="mdiArrowLeft" @click="$router.go(-1)"> </v-btn>
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <manage-card
        color="primary"
        label="QRCode"
        :columns="QRCodeColumns"
        :data="qrcode"
        :data-url="MANAGE_QRCODE_URL"
        primary-key="dId"
        :on-edit-data="
          (data) => {
            qrcode = { ...qrcode, ...data };
            return true;
          }
        "
        :on-delete-data="() => router.go({ name: 'ManageQRCodeList' })"
        :items="{
          ...(qrcode?.user ? { 擁有者: (qrcode) => qrcode.user } : {}),
          建立時間: (qrcode) => formatDateTime(qrcode.createdAt),
        }"
      >
        <template v-slot:title>
          {{ qrcode?.qrName || "(沒有名字)" }}
          <v-tooltip v-if="qrcodeTooltips" location="top">
            <template v-slot:activator="{ props }">
              <v-icon :icon="mdiAlertCircle" v-bind="props" color="red" />
            </template>
            <v-col>
              <v-row>
                <h4>重要提醒</h4>
              </v-row>
              <v-row>
                <ul>
                  <li v-for="tip of qrcodeTooltips" :key="tip">{{ tip }}</li>
                </ul>
              </v-row>
            </v-col>
          </v-tooltip>
        </template>
        <template v-slot:擁有者="{ value }">
          <role-chip :role="value?.uRole" />
          {{ value?.uEmail }}
        </template>
      </manage-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <div class="text-h5">
        內容物列表
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-icon :icon="mdiAlertCircle" v-bind="props" />
          </template>
          <v-col>
            <v-row>
              <h4>重要提醒</h4>
            </v-row>
            <v-row>
              <p>
                當戳戳樂被戳完時，會將所有獎項從戳戳樂中拿出來。
                <br />
                您需要設定戳戳樂事件或手動將獎項放入戳戳樂中，以免造成戳戳樂被戳完，而並未出獎項的狀況。
              </p>
            </v-row>
          </v-col>
        </v-tooltip>
      </div>
      <Table
        :items="qrcode?.qrcodecontents || []"
        :columns="QRCodeContentColumns"
        :on-add-data="submitAddQRCodeContent"
      >
        <!-- 
        :columns=""
        :on-add-data=""
        -->
        <template v-slot="item">
          <manage-card
            label="內容物"
            :columns="QRCodeContentColumns"
            :data="item"
            :data-url="MANAGE_QRCODECONTENT_URL"
            primary-key="qrcId"
            :on-edit-data="
              (data) =>
                qrcode.qrcodecontents.splice(
                  qrcode.qrcodecontents.findIndex(
                    ({ qrcId }) => qrcId === item.qrcId
                  ),
                  1,
                  data
                )
            "
            :on-delete-data="
              () =>
                qrcode.qrcodecontents.splice(
                  qrcode.qrcodecontents.findIndex(
                    ({ qrcId }) => qrcId === item.qrcId
                  ),
                  1
                )
            "
            :items="{
              類型: (item) => QRCodeContentTypeNameMap[item.qrcType],
              數量: (item) => item.qrcCount,
              ...(item.qrcData ? { 資料: (item) => item.qrcData } : {}),
              建立時間: (item) => formatDateTime(item.createdAt),
            }"
          >
          </manage-card>
        </template>
      </Table>
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <div class="text-h5">
        QRCodeItem列表
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-icon :icon="mdiAlertCircle" v-bind="props" />
          </template>
          <v-col>
            <v-row>
              <h4>重要提醒</h4>
            </v-row>
            <v-row>
              <p>
                當戳戳樂被戳完時，會將所有獎項從戳戳樂中拿出來。
                <br />
                您需要設定戳戳樂事件或手動將獎項放入戳戳樂中，以免造成戳戳樂被戳完，而並未出獎項的狀況。
              </p>
            </v-row>
          </v-col>
        </v-tooltip>
      </div>
      <Table
        :items="qrcode?.qrcodeitems || []"
        :columns="QRCodeItemColumns"
        :on-add-data="submitAddQRCodeItem"
      >
        <!-- 
      :columns=""
      :on-add-data=""
      -->
        <template v-slot="item">
          <manage-card
            label="QRCodeItem"
            :columns="QRCodeItemColumns"
            :data="item"
            :data-url="MANAGE_QRCODE_URL"
            primary-key="qrId"
            :on-delete-data="
              () =>
                qrcode.qrcodes.splice(
                  qrcode.qrcodes.findIndex(({ qrId }) => qrId === item.qrId),
                  1
                )
            "
            :items="{
              是否啟用: (item) => item.qriEnable,
              建立時間: (item) => formatDateTime(item.createdAt),
            }"
          >
            <template v-slot:subtitle>
              {{ item.qriId }}
            </template>
            <template v-slot:是否啟用="{ value }">
              <v-icon :icon="value ? mdiCheck : mdiClose" />
            </template>
          </manage-card>
        </template>
      </Table>
    </v-col>
  </v-row>
</template>
