<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { CommonRules } from "../data/form.mjs";
import { loadingState } from "../store/index.mjs";
import { login } from "../utils/auth.utils.mjs";

const router = useRouter();

const form = ref();
const email = ref("");
const password = ref("");

const onSubmit = () =>
  login(email.value, password.value).then(() => router.push({ name: "Home" }));
</script>
<template>
  <v-container class="fill-height">
    <v-col align="center">
      <v-sheet class="pa-6" border rounded max-width="600">
        <p class="text-h6 text-md-h5 text-lg-h4">登入</p>
        <v-form v-model="form" @submit.prevent="onSubmit">
          <v-text-field
            v-model="email"
            :readonly="loadingState"
            label="電子信箱"
            :rules="CommonRules.Email"
            type="email"
            clearable
            placeholder="請輸入電子信箱"
          />

          <v-text-field
            v-model="password"
            :readonly="loadingState"
            label="密碼"
            type="password"
            :rules="CommonRules.Password"
            clearable
            placeholder="請輸入密碼"
          />

          <v-btn
            :disabled="!form"
            block
            color="primary"
            type="submit"
            class="mb-4"
            >登入</v-btn
          >

          <v-btn block color="secondary" :to="{ name: 'Register' }">註冊</v-btn>
        </v-form>
      </v-sheet>
    </v-col>
  </v-container>
</template>
