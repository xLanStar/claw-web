<script setup>
import { useSlots } from "vue";

const slots = useSlots();

defineProps({
  items: Object,
});
</script>

<template>
  <template v-if="items">
    <v-col>
      <v-row v-for="key of Object.keys(items)" :key="key" align="center">
        {{ key }}：
        <template v-if="slots[key]">
          <slot :name="key" v-bind="{ value: items[key] }" />
        </template>
        <template v-else>{{ items[key] ?? `(沒有${key})` }}</template>
      </v-row>
    </v-col>
  </template>
</template>
