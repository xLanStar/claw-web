<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { RoleColor, RoleName } from "../data/role.mjs";
import APIHelper from "../helper/APIHelpr.mjs";
import { MANAGE_USER_LIST_URL, MANAGE_USER_URL } from "../reference.mjs";

const route = useRoute();

const users = ref([]);
const search = ref("");
const user = ref({});

onMounted(() => {
  APIHelper.get(MANAGE_USER_LIST_URL).then((data) => (users.value = data));
});

watchEffect(() => {
  const uId = route.params.uId;
  if (!uId) return;
  APIHelper.get(`${MANAGE_USER_URL}/${uId}`).then(
    (data) => (user.value = data)
  );
});
</script>

<template>
  <v-data-iterator
    v-show="!route.params.uId"
    :items="users"
    :items-per-page="12"
    :search="search"
  >
    <template v-slot:header>
      <v-toolbar class="px-2">
        <v-text-field
          v-model="search"
          density="comfortable"
          hide-details
          placeholder="搜尋"
          prepend-inner-icon="search"
          style="max-width: 300px"
          variant="solo"
        />
      </v-toolbar>
    </template>

    <template v-slot:default="{ items }">
      <v-container class="pa-0" fluid>
        <v-row dense>
          <v-col v-for="(item, i) in items" :key="i" cols="12" md="6">
            <v-card
              link
              :to="{ name: route.name, params: { uId: item.raw.uId } }"
            >
              <template v-slot:title>
                <v-chip label :color="RoleColor[item.raw.uRole]">
                  {{ RoleName[item.raw.uRole] }}
                </v-chip>
                {{ item.raw.uName || "(沒有姓名)" }}
              </template>

              <template v-slot:subtitle>
                {{ item.raw.uEmail }}
              </template>

              <template v-slot:text>
                {{ item.raw.uPhoneNumber || "(沒有電話號碼)" }}
                <br />
                {{ item.raw.uAddress || "(沒有地址)" }}
              </template>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template v-slot:footer="{ page, pageCount }">
      <v-pagination :model-value="page" :length="pageCount"></v-pagination>
    </template>
  </v-data-iterator>
  <template v-if="route.params.uId">
    <v-row>
      <v-col>
        <v-card prepend-icon="person" color="primary">
          <template v-slot:title>{{ user?.uEmail }}</template>
          <template v-slot:subtitle>
            <v-chip label :color="RoleColor[user?.uRole]">
              {{ RoleName[user?.uRole] }}
            </v-chip>
          </template>
          <template v-slot:actions> </template>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card
          prepend-icon="diamond"
          :title="user?.uDiamond"
          subtitle="鑽石"
          text="可購買禮包"
          color="secondary"
          link
          to="/shop"
        />
      </v-col>
      <v-col>
        <v-card
          prepend-icon="attach_money"
          :title="user?.uGold"
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
        <v-card
          prepend-icon="tag"
          :title="user?.uClawChance + ' 次'"
          subtitle="夾娃娃機會"
          color="secondary"
          link
          to="/claw"
        />
      </v-col>
      <v-col>
        <v-card
          prepend-icon="tag"
          :title="user?.uDrawChance + ' 次'"
          subtitle="戳戳樂機會"
          color="secondary"
          link
          to="/draw"
        />
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
</template>
