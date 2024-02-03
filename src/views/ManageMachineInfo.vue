<script setup>
import ManageCard from "@/components/ManageCard.vue";
import RoleChip from "@/components/RoleChip.vue";
import Table from "@/components/Table.vue";
import { InputType, useRule } from "@/data/form.mjs";
import { formatDateTime } from "@/utils/date.utils.mjs";
import { mdiAlertCircle, mdiArrowLeft, mdiPrinter } from "@mdi/js";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import APIHelper from "../helper/APIHelpr.mjs";
import { MANAGE_MACHINE_URL, MANAGE_QRCODE_URL } from "../reference.mjs";

const MachineEditColumns = [
  {
    title: "機台名字",
    dataIndex: "mName",
    inputType: InputType.Text,
  },
];

const QRCodeColumns = [
  {
    title: "名稱",
    dataIndex: "qrName",
    inputType: InputType.Text,
    inputProps: {
      rules: [useRule.required("名稱")],
    },
  },
];

// const QRCodeContentColumns = [
//   {
//     title: "內容物類型",
//     dataIndex: "qrcType",
//     parse: (_, record) => record.deTrigger.type,
//     inputType: InputType.Select,
//     inputProps: {
//       items: [],
//       itemProps: ({ label }) => ({ title: label }),
//       rules: [useRule.required("內容物類型")],
//     },
//   },
//   {
//     checkEdit: (_, data) =>
//       data.deTrigger.type === DrawEventTriggerType.HOLE_LEFT,
//     vif: (_, data) => data.deTriggerType === DrawEventTriggerType.HOLE_LEFT,
//     title: "抽獎剩餘多少洞數時觸發",
//     parse: (_, record) => record.deTrigger.data,
//     dataIndex: "deTriggerHoleLeft",
//     inputType: InputType.Number,
//     inputProps: {
//       rules: [
//         useRule.min("抽獎獎項位置", 0, true),
//         useRule.max("抽獎獎項位置", draw.value.dHoleCount - 1, true),
//         useRule.integer("抽獎獎項位置", true),
//       ],
//     },
//   },
//   {
//     title: "抽獎事件內容類型",
//     dataIndex: "deContentType",
//     parse: (_, record) => record.deContent.type,
//     inputType: InputType.Select,
//     inputProps: {
//       items: DrawEventContentTypeOptions,
//       itemProps: ({ label }) => ({ title: label }),
//       rules: [useRule.required("抽獎事件內容類型")],
//     },
//   },
//   {
//     checkEdit: (_, data) =>
//       data.deContent.type === DrawEventContentType.ADD_PRIZE_RANDOM,
//     vif: (_, data) =>
//       data.deContentType === DrawEventContentType.ADD_PRIZE_RANDOM,
//     title: "抽獎獎項",
//     dataIndex: "deContentdpIds",
//     parse: (_, record) => record.deContent.data,
//     inputType: InputType.Select,
//     inputProps: {
//       multiple: true,
//       items: draw.value.drawprizes?.map?.(({ dpId, dpTitle, dpName }) => ({
//         value: dpId,
//         title: `${dpTitle} - ${dpName}`,
//       })),
//     },
//   },
// ];

const router = useRouter();
const route = useRoute();

const machine = ref({});
const pdf = ref();

const machineTooltips = computed(() => null);

const onSubmitAddQRCode = (data) =>
  APIHelper.post(MANAGE_QRCODE_URL, {
    ...data,
    mId: route.params.mId,
  }).then((data) => machine.value.qrcodes?.push(data));

const onSubmitPrint = async () => {
  // APIHelper.get(`${MANAGE_MACHINE_ALL_QRCODE_URL}/${route.params.mId}`).then(
  //   (data) => {
  //     const a = document.createElement("a");
  //     a.href = URL.createObjectURL(
  //       new Blob([data], { type: "application/pdf" })
  //     );
  //     a.click();
  //   }
  // );
};

onMounted(() => {
  APIHelper.get(`${MANAGE_MACHINE_URL}/${route.params.mId}`).then(
    (data) => (machine.value = data)
  );
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
        label="機台"
        :columns="MachineEditColumns"
        :data="machine"
        :data-url="MANAGE_MACHINE_URL"
        primary-key="mId"
        :on-edit-data="
          (data) => {
            machine = { ...machine, ...data };
            return true;
          }
        "
        :on-delete-data="() => router.go({ name: 'ManageMachineList' })"
        :items="{
          ...(machine?.user ? { 擁有者: (machine) => machine.user } : {}),
          建立時間: (machine) => formatDateTime(machine.createdAt),
        }"
      >
        <template v-slot:title>
          {{ machine?.mName || "(沒有名字)" }}
          <v-tooltip v-if="machineTooltips" location="top">
            <template v-slot:activator="{ props }">
              <v-icon :icon="mdiAlertCircle" v-bind="props" color="red" />
            </template>
            <v-col>
              <v-row>
                <h4>重要提醒</h4>
              </v-row>
              <v-row>
                <ul>
                  <li v-for="tip of machineTooltips" :key="tip">{{ tip }}</li>
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
        QRCode列表
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
                當抽獎被戳完時，會將所有獎項從抽獎中拿出來。
                <br />
                您需要設定抽獎事件或手動將獎項放入抽獎中，以免造成抽獎被戳完，而並未出獎項的狀況。
              </p>
            </v-row>
          </v-col>
        </v-tooltip>
      </div>
      <Table
        :items="machine?.qrcodes || []"
        :columns="QRCodeColumns"
        :on-add-data="onSubmitAddQRCode"
      >
        <template v-slot:append-title>
          <v-btn :prepend-icon="mdiPrinter" @click="onSubmitPrint">
            列印全部
          </v-btn>
        </template>
        <!-- 
        :columns=""
        :on-add-data=""
        -->
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
                item.qrcodeitems?.filter(({ qriEnable }) => qriEnable === true)
                  ?.length,
              停用數量: (item) =>
                item.qrcodeitems?.filter(({ qriEnable }) => qriEnable === false)
                  ?.length,
              建立時間: (item) => formatDateTime(item.createdAt),
            }"
          >
            <template v-slot:title>
              {{ item.qrName || "(沒有名字)" }}
            </template>
          </manage-card>
        </template>
      </Table>
    </v-col>
  </v-row>
</template>
