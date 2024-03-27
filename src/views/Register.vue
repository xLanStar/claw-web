<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { CommonRules } from "../data/form.mjs";
import { loadingState } from "../store/index.mjs";
import { register } from "../utils/auth.utils.mjs";

const router = useRouter();

const form = ref();
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const name = ref("");
const phoneNumber = ref("");
const address = ref("");

const onSubmit = () =>
  register(
    email.value,
    password.value,
    name.value,
    phoneNumber.value,
    address.value
  ).then(() => router.push({ name: "Home" }));
</script>
<template>
  <v-container class="fill-height">
    <v-col align="center">
      <v-sheet class="pa-6" border rounded max-width="600">
        <p class="text-h6 text-md-h5 text-lg-h4">註冊</p>
        <v-form v-model="form" @submit.prevent="onSubmit">
          <v-text-field
            v-model="email"
            label="電子信箱"
            :rules="CommonRules.Email"
            type="email"
            clearable
            placeholder="請輸入電子信箱"
          />

          <v-text-field
            v-model="password"
            label="密碼"
            type="password"
            :rules="CommonRules.Password"
            clearable
            placeholder="請輸入密碼"
          />

          <v-text-field
            v-model="confirmPassword"
            label="密碼"
            type="password"
            :rules="[(v) => v === password || '密碼不一致']"
            clearable
            placeholder="請再次輸入密碼"
          />

          <v-text-field
            v-model="name"
            label="收貨人姓名"
            :rules="[CommonRules.Required]"
            clearable
            placeholder="寄送包裹時需要，未來可再修改"
          />

          <v-text-field
            v-model="phoneNumber"
            label="收貨人電話號碼（選填）"
            clearable
            type="tel"
            placeholder="寄送包裹時需要，未來可再修改"
          />

          <v-text-field
            v-model="address"
            label="收貨人地址（選填）"
            type="telnumber"
            clearable
            placeholder="寄送包裹時需要，未來可再修改"
          />

          <v-btn
            :disabled="!form || loadingState"
            block
            color="primary"
            type="submit"
            class="mb-4"
            >註冊</v-btn
          >

          <v-btn block color="secondary" :to="{ name: 'Login' }">登入</v-btn>
        </v-form>
      </v-sheet>
    </v-col>
  </v-container>
</template>
