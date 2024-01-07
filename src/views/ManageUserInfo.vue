<script setup>
import Form from "@/components/Form.vue";
import Modal from "@/components/Modal.vue";
import { CommonRules, InputType, useRule } from "@/data/form.mjs";
import {
  mdiAccount,
  mdiArrowLeft,
  mdiCash,
  mdiDiamond,
  mdiPencil,
  mdiPound,
  mdiTrashCan,
  mdiViewList,
} from "@mdi/js";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { RoleColor, RoleName, Roles } from "../data/role.mjs";
import APIHelper from "../helper/APIHelpr.mjs";
import { MANAGE_USER_LOGIN_LOG_URL, MANAGE_USER_URL } from "../reference.mjs";

const headers = [
  { title: "時間", value: "createdAt", sortable: true },
  { title: "IP", value: "ip" },
];

const columns = [
  {
    title: "電子信箱",
    dataIndex: "uEmail",
    inputType: InputType.Email,
    inputProps: {
      rules: CommonRules.Email,
    },
  },
  {
    title: "密碼",
    dataIndex: "uPassword",
    inputType: InputType.Text,
    inputProps: {
      rules: CommonRules.Password,
    },
  },
  {
    title: "身分",
    dataIndex: "uRole",
    inputType: InputType.Select,
    inputProps: {
      items: Roles,
      itemProps: (v) => ({ title: RoleName[v] }),
    },
  },
  {
    title: "鑽石",
    dataIndex: "uDiamond",
    inputType: InputType.Number,
    inputProps: {
      rules: [useRule.min("鑽石", 0)],
    },
  },
  {
    title: "金幣",
    dataIndex: "uGold",
    inputType: InputType.Number,
    inputProps: {
      rules: [useRule.min("金幣", 0)],
    },
  },
  {
    title: "夾娃娃機會",
    dataIndex: "uClawChance",
    inputType: InputType.Number,
    inputProps: {
      rules: [useRule.min("金幣", 0)],
    },
  },
  {
    title: "收貨人姓名",
    dataIndex: "uName",
    inputType: InputType.Text,
  },
  {
    title: "收貨人電話號碼",
    dataIndex: "uPhoneNumber",
    inputType: InputType.Phone,
  },
  {
    title: "收貨人地址",
    dataIndex: "uAddress",
    inputType: InputType.Text,
  },
];

const router = useRouter();
const route = useRoute();

const user = ref({});
const panel = ref();
const loginlogs = ref([]);
const editDialog = ref();
const deleteDialog = ref(false);

const submitEdit = async (data) => {
  if (!Object.keys(data).length) {
    editDialog.value = false;
    return;
  }
  await APIHelper.put(`${MANAGE_USER_URL}/${route.params.uId}`, data).then(
    (data) => {
      user.value = data;
      editDialog.value = false;
    }
  );
};

const handleDelete = () =>
  APIHelper.delete(`${MANAGE_USER_URL}/${route.params.uId}`).then(() => {
    deleteDialog.value = false;
    router.go(-1);
  });

const fetchLoginLog = () =>
  APIHelper.get(`${MANAGE_USER_LOGIN_LOG_URL}/${route.params.uId}`).then(
    (data) => (loginlogs.value = data)
  );

onMounted(() => {
  APIHelper.get(`${MANAGE_USER_URL}/${route.params.uId}`).then(
    (data) => (user.value = data)
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
      <v-card :prepend-icon="mdiAccount" color="primary">
        <template v-slot:title>
          {{ user?.uEmail }}
        </template>
        <template v-slot:subtitle>
          <v-chip label :color="RoleColor[user?.uRole]">
            {{ RoleName[user?.uRole] }}
          </v-chip>
        </template>
        <template v-slot:actions>
          <div class="d-flex align-center ga-2">
            <v-dialog v-model="editDialog" persistent width="600">
              <template v-slot:activator="{ props }">
                <v-chip :prepend-icon="mdiPencil" v-bind="props"> 編輯 </v-chip>
              </template>
              <Form
                :columns="columns"
                :data="user"
                diff-only
                :on-submit-success="submitEdit"
                @cancel="editDialog = false"
              />
            </v-dialog>
            <Modal
              :show="deleteDialog"
              :toggle="() => (deleteDialog = !deleteDialog)"
              title="確定要刪除？"
              text="刪除後將無法復原！"
              :on-confirm="handleDelete"
            >
              <template v-slot="{ props }">
                <v-chip
                  :prepend-icon="mdiTrashCan"
                  color="red"
                  v-bind="props"
                  @click="deleteDialog = true"
                >
                  刪除
                </v-chip>
              </template>
            </Modal>
          </div>
        </template>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-card
        :prepend-icon="mdiDiamond"
        :title="user?.uDiamond"
        subtitle="鑽石"
        color="secondary"
      >
        <template v-slot:actions>
          <v-chip :prepend-icon="mdiViewList" @click.stop>
            查看購買紀錄
          </v-chip>
        </template>
      </v-card>
    </v-col>
    <v-col>
      <v-card
        :prepend-icon="mdiCash"
        :title="user?.uGold"
        subtitle="金幣"
        color="secondary"
      >
        <template v-slot:actions>
          <v-chip :prepend-icon="mdiViewList" @click.stop>
            查看兌換紀錄
          </v-chip>
        </template>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-card
        :prepend-icon="mdiPound"
        :title="user?.uClawChance + ' 次'"
        subtitle="夾娃娃機會"
        color="secondary"
      >
        <template v-slot:actions>
          <v-chip :prepend-icon="mdiViewList" @click.stop>
            查看使用紀錄
          </v-chip>
        </template>
      </v-card>
    </v-col>
    <v-col>
      <v-card
        :prepend-icon="mdiPound"
        :title="user?.uDrawChance + ' 次'"
        subtitle="戳戳樂機會"
        color="secondary"
      >
        <template v-slot:actions>
          <v-row dense>
            <v-col cols="auto">
              <v-chip :prepend-icon="mdiViewList" @click.stop>
                查看次數詳細來源
              </v-chip>
            </v-col>
          </v-row>
        </template>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-expansion-panels :v-model="panel" multiple>
        <v-expansion-panel
          value="loginlog"
          @group:selected="$event.value && fetchLoginLog()"
        >
          <v-expansion-panel-title>登入紀錄</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-data-table :headers="headers" :items="loginlogs">
              <template v-slot:item.createdAt="{ value }">
                {{ new Date(value).toLocaleString() }}
              </template>
            </v-data-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
  <!-- <v-row>
      <v-col>
        <v-progress-linear
          :model-value="2"
          color="secondary"
          height="25"
          rounded
        >
          <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
      </v-col>
    </v-row> -->
</template>