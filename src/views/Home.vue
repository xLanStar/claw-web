<script setup>
import APIHelper from "@/helper/APIHelpr.mjs";
import {
  USER_CHANGE_LOG_URL,
  USER_INFO_URL,
  USER_LOGIN_LOG_URL,
} from "@/reference.mjs";
import {
  mdiAccount,
  mdiBitcoin,
  mdiCard,
  mdiCash,
  mdiDiamond,
  mdiLogout,
  mdiMoonWaningCrescent,
  mdiQrcodeScan,
  mdiRefresh,
  mdiTeddyBear,
  mdiWhiteBalanceSunny,
} from "@mdi/js";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";
import { parseChangeLogValue, parseChangeReason } from "../data/changeLog.mjs";
import { RoleColor, RoleName } from "../data/role.mjs";
import { userState } from "../store/auth.mjs";
import { logout } from "../utils/auth.utils.mjs";

const theme = useTheme();

const loginLogHeaders = [
  { title: "時間", value: "createdAt", sortable: true },
  { title: "IP", value: "ip" },
];
const changeLogHeaders = [
  { title: "時間", value: "createdAt", sortable: true },
  { title: "原因", value: "clReason" },
  { title: "內容", value: "clValue" },
];
const router = useRouter();
const loading = ref(false);
const loginlogs = ref();
const changelogs = ref();
const panel = ref();

// refresh
const onClickRefresh = async () => {
  loading.value = true;
  await APIHelper.get(USER_INFO_URL).then((data) => (userState.value = data));
  loading.value = false;
};

// logout
const onClickLogout = () => {
  logout();
  router.push({ name: "Login" });
};

const fetchLoginLog = () =>
  !loginlogs.value &&
  APIHelper.get(USER_LOGIN_LOG_URL).then((data) => (loginlogs.value = data));

const fetchChangeLog = () =>
  !changelogs.value &&
  APIHelper.get(USER_CHANGE_LOG_URL).then((data) => (changelogs.value = data));

const changeDarkMode = (value) =>
  localStorage.setItem(
    "theme",
    (theme.global.name.value = value ? "dark" : "light")
  );
</script>

<template>
  <v-row>
    <v-col>
      <v-skeleton-loader v-if="loading" type="card" color="primary" />
      <v-card v-else :prepend-icon="mdiAccount" color="primary">
        <template v-slot:title>{{ userState?.uEmail }}</template>
        <template v-slot:subtitle>
          <v-btn label :color="RoleColor[userState?.uRole]">
            {{ RoleName[userState?.uRole] }}
          </v-btn>
        </template>
        <template v-slot:actions>
          <v-btn :prepend-icon="mdiLogout" color="red" @click="onClickLogout">
            登出
          </v-btn>
        </template>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <div class="d-flex align-center justify-start ga-2">
        <v-btn :prepend-icon="mdiQrcodeScan" :to="{ name: 'Scan' }">掃描</v-btn>
        <div>
          <v-switch
            :label="
              theme.global.name.value === 'dark' ? '深色模式' : '淺色模式'
            "
            hide-details
            :model-value="theme.global.name.value === 'dark'"
            :true-icon="mdiMoonWaningCrescent"
            :false-icon="mdiWhiteBalanceSunny"
            @update:model-value="changeDarkMode($event)"
          />
        </div>
        <v-btn :prepend-icon="mdiRefresh" @click="onClickRefresh">
          重新整理
        </v-btn>
      </div>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-skeleton-loader v-if="loading" type="card" color="secondary" />
      <v-card
        v-else
        :prepend-icon="mdiDiamond"
        :title="userState?.uDiamond"
        subtitle="鑽石"
        text="可購買禮包"
        color="secondary"
        link
        to="/shop"
      />
    </v-col>
    <v-col>
      <v-skeleton-loader v-if="loading" type="card" color="secondary" />
      <v-card
        v-else
        :prepend-icon="mdiCash"
        :title="userState?.uGold"
        subtitle="金幣"
        text="可兌換商品"
        color="secondary"
        link
        to="/shop"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-skeleton-loader v-if="loading" type="card" color="secondary" />
      <v-card
        v-else
        :prepend-icon="mdiTeddyBear"
        :title="userState?.uClawChance + ' 次'"
        subtitle="夾娃娃機會"
        color="secondary"
        link
        to="/claw"
      />
    </v-col>
    <v-col>
      <v-skeleton-loader v-if="loading" type="card" color="secondary" />
      <v-card
        v-else
        :prepend-icon="mdiBitcoin"
        :title="
          userState?.usertokens.reduce((acc, cur) => acc + cur.utAmount, 0) +
          ' 枚'
        "
        subtitle="代幣"
        color="secondary"
        link
        to="/draw"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-skeleton-loader v-if="loading" type="card" color="secondary" />
      <v-card
        v-else
        :prepend-icon="mdiCard"
        title="備註欄"
        :text="userState?.uRemark"
        color="secondary"
      />
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
            <v-data-table :headers="loginLogHeaders" :items="loginlogs">
              <template v-slot:item.createdAt="{ value }">
                {{ new Date(value).toLocaleString() }}
              </template>
            </v-data-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel
          value="changelog"
          @group:selected="$event.value && fetchChangeLog()"
        >
          <v-expansion-panel-title>變動紀錄</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-data-table :headers="changeLogHeaders" :items="changelogs">
              <template v-slot:item.createdAt="{ value }" class="test-class">
                {{ new Date(value).toLocaleString() }}
              </template>
              <template v-slot:item.clReason="{ value }">
                {{ parseChangeReason(value) }}
              </template>
              <template
                v-slot:item.clValue="{ item, value }"
                class="test-class"
              >
                <div style="white-space: pre-wrap">
                  {{ parseChangeLogValue(item.clReason, value) }}
                </div>
              </template>
            </v-data-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>
