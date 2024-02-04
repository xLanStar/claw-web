<script setup>
import ManageCard from "@/components/ManageCard.vue";
import Modal from "@/components/Modal.vue";
import RoleChip from "@/components/RoleChip.vue";
import Table from "@/components/Table.vue";
import {
  DrawEventContentType,
  DrawEventContentTypeNameMap,
  DrawEventContentTypeOptions,
  DrawEventTriggerType,
  DrawEventTriggerTypeNameMap,
  DrawEventTriggerTypeOptions,
} from "@/data/drawEvent.mjs";
import { DrawPrizeStatus, DrawPrizeStatusColor } from "@/data/drawPrize.mjs";
import { CommonAccept, InputType, useRule } from "@/data/form.mjs";
import { formatDateTime } from "@/utils/date.utils.mjs";
import { mdiAlertCircle, mdiArrowLeft, mdiImage, mdiRestore } from "@mdi/js";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import APIHelper from "../helper/APIHelpr.mjs";
import {
  MANAGE_DRAWEVENT_URL,
  MANAGE_DRAWPRIZE_URL,
  MANAGE_DRAW_RESET_URL,
  MANAGE_DRAW_URL,
  RESOURCE_IMAGE_DRAWPRIZE_URL,
} from "../reference.mjs";

const router = useRouter();
const route = useRoute();

const draw = ref({});
const panel = ref();

const drawTooltips = computed(() => {
  const result = [];
  if (draw.value.drawprizes?.length === 0) {
    result.push("抽獎目前沒有獎項，請新增獎項！");
  } else if (
    !draw.value.drawevents?.some(
      (v) => v.deContentType === DrawEventContentType.ADD_PRIZE_RANDOM
    )
  ) {
    result.push(
      "抽獎目前有獎項，但沒有為其設定丟入抽獎的事件，請新增抽獎事件！"
    );
  }
  return result.length ? result : null;
});

const DrawEditColumns = [
  {
    title: "抽獎名稱",
    dataIndex: "dName",
    inputType: InputType.Text,
  },
  {
    title: "抽獎啟用狀態（非打勾: 禁用, 打勾: 啟用）",
    dataIndex: "dEnable",
    inputType: InputType.Boolean,
  },
  {
    title: "抽獎洞數（1~3000）",
    dataIndex: "dHoleCount",
    inputType: InputType.Number,
    inputProps: {
      rules: [
        useRule.min("抽獎洞數", 1),
        useRule.max("抽獎洞數", 3000),
        useRule.integer("抽獎洞數"),
      ],
    },
  },
  {
    title: "抽獎所需代幣數量",
    dataIndex: "dCost",
    inputType: InputType.Number,
    inputProps: {
      rules: [
        useRule.min("抽獎所需代幣數量", 1),
        useRule.integer("抽獎所需代幣數量"),
      ],
    },
  },
];

const DrawPrizeColumns = computed(() => [
  {
    title: "抽獎獎項位置（空值代表尚未進入抽獎）",
    dataIndex: "dpPosition",
    inputType: InputType.Text,
    inputProps: {
      rules: [
        useRule.min("抽獎獎項位置", 0, true),
        useRule.max("抽獎獎項位置", draw.value.dHoleCount - 1, true),
        useRule.integer("抽獎獎項位置", true),
      ],
    },
    transform: (v) => (!!v ? Number(v) : null),
  },
  // {
  //   title: "抽獎獎項狀態（打勾: 已有人得獎）",
  //   dataIndex: "dpStatus",
  //   inputType: InputType.Boolean,
  //   defaultValue: false,
  //   inputProps: {
  //     rules: [useRule.required("抽獎獎項狀態")],
  //   },
  // },
  {
    title: "抽獎獎項獎次",
    dataIndex: "dpTitle",
    inputType: InputType.Text,
    inputProps: {
      rules: [useRule.required("抽獎獎項獎次")],
    },
  },
  {
    title: "抽獎獎項名稱",
    dataIndex: "dpName",
    inputType: InputType.Text,
    inputProps: {
      rules: [useRule.required("抽獎獎項名稱")],
    },
  },
  {
    checkEdit: (_, __, mode) => mode === "add",
    vif: (_, __, mode) => mode === "add",
    title: "抽獎獎項圖片",
    dataIndex: "dpImage",
    inputType: InputType.File,
    inputProps: {
      "show-size": true,
      prependIcon: mdiImage,
      accept: CommonAccept.Image,
    },
    transform: (v) => (v === null || v === undefined ? null : v[0]),
  },
]);

const DrawEventAddColumns = computed(() => [
  {
    title: "抽獎事件觸發類型",
    dataIndex: "deTriggerType",
    // parse: (_, record) => record?.deTriggerType,
    inputType: InputType.Select,
    inputProps: {
      items: DrawEventTriggerTypeOptions,
      rules: [useRule.required("抽獎事件觸發類型")],
    },
  },
  {
    checkEdit: (_, data) =>
      data?.deTriggerType === DrawEventTriggerType.HOLE_LEFT,
    vif: (_, data) => data.deTriggerType === DrawEventTriggerType.HOLE_LEFT,
    title: "抽獎剩餘多少洞數時觸發",
    dataIndex: "deTriggerData",
    inputType: InputType.Number,
    inputProps: {
      rules: [
        useRule.min("抽獎獎項位置", 0, true),
        useRule.max("抽獎獎項位置", draw.value.dHoleCount - 1, true),
        useRule.integer("抽獎獎項位置", true),
      ],
    },
  },
  {
    title: "抽獎事件內容類型",
    dataIndex: "deContentType",
    inputType: InputType.Select,
    inputProps: {
      items: DrawEventContentTypeOptions,
      rules: [useRule.required("抽獎事件內容類型")],
    },
  },
  {
    checkEdit: (_, data) =>
      data?.deContentType === DrawEventContentType.ADD_PRIZE_RANDOM,
    vif: (_, data) =>
      data.deContentType === DrawEventContentType.ADD_PRIZE_RANDOM,
    title: "抽獎獎項",
    dataIndex: "deContentData",
    inputType: InputType.Select,
    inputProps: {
      multiple: true,
      items: draw.value.drawprizes?.map?.(({ dpId, dpTitle, dpName }) => ({
        value: dpId,
        title: `${dpTitle} - ${dpName}`,
      })),
    },
  },
]);

const addDrawPrize = async (data) => {
  const formData = new FormData();
  formData.append("dpImage", data.dpImage);
  formData.append(
    "content",
    JSON.stringify({
      ...Object.keys(data)
        .filter((k) => k !== "dpImage")
        .reduce((acc, k) => ({ ...acc, [k]: data[k] }), {}),
      dId: draw.value.dId,
    })
  );
  return APIHelper.post(MANAGE_DRAWPRIZE_URL, formData).then((data) => {
    draw.value.drawprizes?.push(data);
  });
};

const addDrawEvent = async (data) =>
  APIHelper.post(MANAGE_DRAWEVENT_URL, {
    ...data,
    dId: draw.value.dId,
  }).then((data) => {
    draw.value.drawevents.push(data);
  });
onMounted(() => {
  APIHelper.get(`${MANAGE_DRAW_URL}/${route.params.dId}`).then(
    (data) => (draw.value = data)
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
        label="抽獎"
        :columns="DrawEditColumns"
        :data="draw"
        :data-url="MANAGE_DRAW_URL"
        primary-key="dId"
        :on-edit-data="
          (data) => {
            draw = { ...draw, ...data };
            return true;
          }
        "
        :on-delete-data="() => router.go({ name: 'ManageDrawList' })"
        :items="{
          ...(draw?.user ? { 擁有者: (draw) => draw.user } : {}),
          狀態: (draw) => draw.dEnable,
          洞數: (draw) => draw.dHoleCount,
          剩餘洞數: (draw) => draw.dHoleLeft,
          剩餘獎項: (draw) => draw.dPrizeLeft,
          所需代幣: (draw) => draw.dCost,
          建立時間: (draw) => formatDateTime(draw.createdAt),
        }"
      >
        <template v-slot:title>
          {{ draw?.dName || "(沒有名字)" }}
          <v-tooltip v-if="drawTooltips" location="top">
            <template v-slot:activator="{ props }">
              <v-icon :icon="mdiAlertCircle" v-bind="props" color="red" />
            </template>
            <v-col>
              <v-row>
                <h4>重要提醒</h4>
              </v-row>
              <v-row>
                <ul>
                  <li v-for="tip of drawTooltips" :key="tip">{{ tip }}</li>
                </ul>
              </v-row>
            </v-col>
          </v-tooltip>
        </template>
        <template v-slot:actions>
          <Modal
            :on-confirm="
              () => {
                APIHelper.post(`${MANAGE_DRAW_RESET_URL}/${draw.dId}`).then(
                  (data) => (draw = data)
                );
              }
            "
          >
            <template v-slot:default="{ props }">
              <v-btn v-bind="props" :prepend-icon="mdiRestore"> 重置 </v-btn>
            </template>
            <template v-slot:title>重置抽獎</template>
            <template v-slot:text>
              <p>確定要重置抽獎嗎？</p>
            </template>
          </Modal>
        </template>
        <template v-slot:擁有者="{ value }">
          <role-chip :role="value?.uRole" />
          {{ value?.uEmail }}
        </template>
        <template v-slot:狀態="{ value }">
          <v-chip size="small" :color="value ? 'green' : 'red'">
            {{ value ? "啟用" : "禁用" }}
          </v-chip>
        </template>
      </manage-card>
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <div class="text-h5">
        抽獎獎項列表
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
        :items="draw?.drawprizes || []"
        :columns="DrawPrizeColumns"
        :on-add-data="addDrawPrize"
      >
        <template v-slot="item">
          <manage-card
            label="抽獎獎項"
            :columns="DrawPrizeColumns"
            :data="item"
            :data-url="MANAGE_DRAWPRIZE_URL"
            primary-key="dpId"
            :on-edit-data="
              (data) =>
                draw.drawprizes.splice(
                  draw.drawprizes.findIndex(({ dpId }) => dpId === item.dpId),
                  1,
                  data
                )
            "
            :on-delete-data="
              () =>
                draw.drawprizes.splice(
                  draw.drawprizes.findIndex(({ dpId }) => dpId === item.dpId),
                  1
                )
            "
            :items="{
              獎次: (item) => item.dpTitle,
              名稱: (item) => item.dpName,
              位置: (item) =>
                item.dpPosition !== null && item.dpPosition !== undefined
                  ? `在 ${item.dpPosition} 號格子`
                  : '尚未進入抽獎',
              狀態: (item) => item.dpStatus,
              建立時間: (item) => formatDateTime(item.createdAt),
            }"
          >
            <template v-slot:title>
              <v-img
                :width="150"
                :height="150"
                :src="`${RESOURCE_IMAGE_DRAWPRIZE_URL}/${item.dpId}`"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular indeterminate color="grey-lighten-5" />
                  </v-row>
                </template>
              </v-img>
            </template>
            <template v-slot:狀態="{ value }">
              <v-chip
                size="small"
                :color="DrawPrizeStatusColor[value]"
                :text-color="value ? 'white' : 'black'"
              >
                {{ DrawPrizeStatus[value] || "未知的狀態" }}
              </v-chip>
            </template>
          </manage-card>
        </template>
      </Table>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <div class="text-h5">抽獎事件列表</div>
      <Table
        :items="draw?.drawevents || []"
        :columns="DrawEventAddColumns"
        :on-add-data="addDrawEvent"
      >
        <template v-slot="item">
          <manage-card
            label="抽獎事件"
            :columns="DrawEventAddColumns"
            :data="item"
            :data-url="MANAGE_DRAWEVENT_URL"
            primary-key="deId"
            :on-edit-data="
              (data) =>
                draw.drawevents.splice(
                  draw.drawevents.findIndex(({ deId }) => deId === item.deId),
                  1,
                  data
                )
            "
            :on-delete-data="
              () =>
                draw.drawevents.splice(
                  draw.drawevents.findIndex(({ deId }) => deId === item.deId),
                  1
                )
            "
            :items="{
              觸發類型: (item) =>
                DrawEventTriggerTypeNameMap[item.deTriggerType],
              觸發資料: (item) => item.deTriggerData,
              內容類型: (item) =>
                DrawEventContentTypeNameMap[item.deContentType],
              內容資料: (item) => item.deContentData,
            }"
          >
            <template v-slot:觸發資料="{ value }">
              <v-chip
                v-if="item.deTriggerType === DrawEventTriggerType.HOLE_LEFT"
                size="small"
              >
                {{ value }}
              </v-chip>
            </template>
            <template v-slot:內容資料="{ value }">
              <v-chip
                v-if="
                  item.deContentType === DrawEventContentType.ADD_PRIZE_RANDOM
                "
                v-for="dpId of value"
                :key="dpId"
                size="small"
              >
                {{
                  draw.drawprizes.find((drawprize) => drawprize.dpId === dpId)
                    .dpName
                }}
              </v-chip>
            </template>
          </manage-card>
        </template>
      </Table>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-expansion-panels :v-model="panel" multiple>
        <v-expansion-panel value="loginlog">
          <!-- @group:selected="$event.value && fetchLoginLog()" -->
          <v-expansion-panel-title>預覽</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row
              v-for="(_, i) of Array(Math.floor((draw.dHoleCount - 1) / 5) + 1)"
              :key="i"
            >
              <template v-for="(_, j) of Array(5)" :key="j">
                <v-col
                  v-if="i * 5 + j < draw.dHoleCount"
                  class="border"
                  align="center"
                >
                  {{ i * 5 + j }}
                </v-col>
              </template>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>
