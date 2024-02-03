<script setup>
import { RoleColor, RoleName } from "../data/role.mjs";

defineProps({
  role: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <v-chip label :color="RoleColor[role]" size="small">
    {{ RoleName[role] || "(未知的身分)" }}
  </v-chip>
</template>
