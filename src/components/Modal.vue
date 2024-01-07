<script setup>
import { mdiCheck, mdiClose } from "@mdi/js";
import { defineProps, ref, useSlots } from "vue";

const slots = useSlots();

const props = defineProps({
  type: { type: String, default: "confirm" },
  title: String,
  subtitle: String,
  text: String,
  show: Boolean,
  toggle: Function,
  confirmIcon: { type: String, default: mdiCheck },
  cancelIcon: { type: String, default: mdiClose },
  onConfirm: Function,
});
const emits = defineEmits(["cancel"]);

const loading = ref(false);

const handleConfirm = async () => {
  loading.value = true;
  if (props.onConfirm) await props.onConfirm();
  loading.value = false;
};
</script>

<template>
  <v-dialog :model-value="show" max-width="400">
    <template v-slot:activator="{ props }">
      <slot v-bind="{ props }" />
    </template>
    <v-sheet>
      <v-card>
        <v-card-title>
          {{ title }}
          <slot name="title" />
        </v-card-title>
        <v-card-subtitle>
          {{ subtitle }}
          <slot name="subtitle" />
        </v-card-subtitle>
        <v-card-text>
          {{ text }}
          <slot name="text" />
        </v-card-text>
        <v-card-actions>
          <slot v-if="slots.actions" name="actions" />
          <template v-else>
            <v-spacer />
            <template v-if="props.type === 'confirm'">
              <v-btn
                text
                :prepend-icon="cancelIcon"
                @click="(toggle && toggle()) || emits('cancel')"
              >
                取消
              </v-btn>
              <v-btn
                :loading="loading"
                text
                :prepend-icon="confirmIcon"
                @click="handleConfirm"
              >
                確定
              </v-btn>
            </template>
          </template>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>
