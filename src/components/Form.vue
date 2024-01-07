<script setup>
import { InputComponentMap, parseInputData } from "@/data/form.mjs";
import { diff } from "@/utils/utils.mjs";
import { mdiCheck, mdiClose } from "@mdi/js";
import { defineEmits, defineProps, ref, useSlots, watchEffect } from "vue";

const slots = useSlots();
const props = defineProps({
  data: Object,
  columns: Array,
  title: String,
  diffOnly: Boolean,
  onSubmit: Function,
  onSubmitSuccess: Function,
});
const emits = defineEmits(["cancel", "submitSuccess"]);

const form = ref(true);
const loading = ref(false);
const editData = ref({});

watchEffect(() => {
  const data = {};
  if (!props.columns) return;
  for (const column of props.columns)
    data[column?.dataIndex] = props.data?.[column?.dataIndex];
  editData.value = data;
});

const handleSubmit = async () => {
  loading.value = true;
  const data = props.diffOnly
    ? diff(props.data, editData.value)
    : editData.value;
  console.log("data", data);
  if (props.onSubmit) await props.onSubmit(form.value, data);
  if (props.onSubmitSuccess && form.value) await props.onSubmitSuccess(data);
  loading.value = false;
};
</script>

<template>
  <v-sheet>
    <v-form v-model="form" @submit.prevent>
      <v-card>
        <v-card-title class="text-h5"> {{ title }} </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                v-for="{
                  dataIndex,
                  cols,
                  title,
                  inputType,
                  inputProps,
                  ...restProps
                } in columns"
                :key="dataIndex"
                :cols="cols || 12"
                v-bind="restProps"
              >
                <slot
                  v-if="slots?.[dataIndex]"
                  :name="dataIndex"
                  v-bind="{ value: editData[dataIndex] }"
                />
                <component
                  v-else
                  :is="InputComponentMap[inputType] || 'v-text-field'"
                  :label="title"
                  :type="inputType"
                  :model-value="editData[dataIndex]"
                  v-bind="inputProps"
                  @update:model-value="
                    editData[dataIndex] = parseInputData(inputType, $event)
                  "
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :prepend-icon="mdiClose"
            variant="text"
            @click="emits('cancel')"
          >
            取消
          </v-btn>
          <v-btn
            :loading="loading"
            :prepend-icon="mdiCheck"
            variant="text"
            @click="handleSubmit"
          >
            確認
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-sheet>
</template>
