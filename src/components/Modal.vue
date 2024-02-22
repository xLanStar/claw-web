<script setup>
import { mdiCheck, mdiClose } from "@mdi/js";
import { ref, useSlots } from "vue";

const slots = useSlots();

const props = defineProps({
  type: { type: String, default: "yesno" },
  title: String,
  subtitle: String,
  text: String,
  show: Boolean,
  toggle: Function,
  confirmIcon: { type: String, default: mdiCheck },
  cancelIcon: { type: String, default: mdiClose },
  onCancel: Function,
  onConfirm: Function,
});

const loading = ref(false);

const handleConfirm = async () => {
  loading.value = true;
  await props.onConfirm?.();
  loading.value = false;
};
</script>

<template>
  <v-dialog :model-value="show" max-width="400">
    <template v-slot:activator="{ props }">
      <slot v-bind="{ props }" />
    </template>
    <template v-slot:default="{ isActive }">
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
              <template v-if="type === 'yesno'">
                <v-btn
                  text
                  :prepend-icon="cancelIcon"
                  @click="
                    () => {
                      isActive.value = false;
                      toggle?.();
                      onCancel?.();
                    }
                  "
                >
                  取消
                </v-btn>
                <v-btn
                  :loading="loading"
                  text
                  :prepend-icon="confirmIcon"
                  @click="
                    async () => {
                      await handleConfirm?.();
                      isActive.value = false;
                    }
                  "
                >
                  確定
                </v-btn>
              </template>
              <template v-if="type === 'confirm'">
                <v-btn
                  :loading="loading"
                  text
                  :prepend-icon="confirmIcon"
                  @click="
                    async () => {
                      await handleConfirm?.();
                      isActive.value = false;
                    }
                  "
                >
                  確定
                </v-btn>
              </template>
            </template>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </template>
  </v-dialog>
</template>
