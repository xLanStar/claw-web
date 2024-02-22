<script setup>
import { InputComponentMap, parseInputData } from "@/data/form.mjs";
import { diff } from "@/utils/utils.mjs";
import { mdiCheck, mdiClose } from "@mdi/js";
import { ref, useSlots, watchEffect } from "vue";

const slots = useSlots();
const props = defineProps({
  mode: String,
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
  for (const { checkEdit, dataIndex, parse, defaultValue } of props.columns) {
    const value = props.data?.[dataIndex] ?? defaultValue;
    if (
      checkEdit && props.data
        ? checkEdit(value, props.data, props.mode) === false
        : false
    )
      continue;
    data[dataIndex] = props.data ? parse?.(value, props.data) ?? value : value;
  }
  editData.value = data;
});

const handleSubmit = async () => {
  loading.value = true;
  // process data
  let data = props.diffOnly ? diff(props.data, editData.value) : editData.value;
  if (Object.keys(data).length === 0) {
    data = null;
  } else {
    for (const { dataIndex, transform } of props.columns) {
      if (transform) {
        data[dataIndex] = transform?.(data[dataIndex], data);
      }
    }
  }
  // callback
  if (props.onSubmit) {
    try {
      await props.onSubmit(form.value, data);
    } catch (_) {}
  }
  if (props.onSubmitSuccess && form.value) {
    try {
      await props.onSubmitSuccess(data);
    } catch (err) {
      console.error(err);
    }
  }
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
              <template
                v-for="{
                  vif,
                  dataIndex,
                  cols,
                  title,
                  inputType,
                  inputProps,
                  ...restProps
                } in columns"
                :key="dataIndex"
              >
                <v-col
                  v-if="vif ? vif(editData[dataIndex], editData, mode) : true"
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
                      (event) => {
                        console.log(event, inputType);
                        editData[dataIndex] = parseInputData(inputType, event);
                      }
                    "
                  />
                </v-col>
              </template>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :prepend-icon="mdiClose"
            @click="emits('cancel')"
          >
            取消
          </v-btn>
          <v-btn
            :loading="loading"
            :prepend-icon="mdiCheck"
            @click="handleSubmit"
          >
            確認
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-sheet>
</template>
