<script setup>
import { useRouter } from "vue-router";
import { RoleColor, RoleName } from "../data/role.mjs";
import { userState } from "../store/auth.mjs";
import { logout } from "../utils/auth.utils.mjs";

const router = useRouter();

const onClickLogout = () => {
  logout();
  router.push({ name: "Login" });
};
</script>

<template>
  <v-row>
    <v-col>
      <v-card prepend-icon="person" color="primary">
        <template v-slot:title>{{ userState?.uEmail }}</template>
        <template v-slot:subtitle>
          <v-chip label :color="RoleColor[userState?.uRole]">
            {{ RoleName[userState?.uRole] }}
          </v-chip>
        </template>
        <template v-slot:actions>
          <v-btn color="red" @click="onClickLogout"> 登出 </v-btn>
        </template>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-card
        prepend-icon="diamond"
        :title="userState?.uDiamond"
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
      <v-card
        prepend-icon="tag"
        :title="userState?.uClawChance + ' 次'"
        subtitle="夾娃娃機會"
        color="secondary"
        link
        to="/claw"
      />
    </v-col>
    <v-col>
      <v-card
        prepend-icon="tag"
        :title="userState?.uDrawChance + ' 次'"
        subtitle="戳戳樂機會"
        color="secondary"
        link
        to="/draw"
      />
    </v-col>
  </v-row>
  <!-- <v-row>
    <v-col>
      <v-progress-linear :model-value="2" color="secondary" height="25" rounded>
        <template v-slot:default="{ value }">
          <strong>{{ Math.ceil(value) }}%</strong>
        </template>
      </v-progress-linear>
    </v-col>
  </v-row> -->
</template>
