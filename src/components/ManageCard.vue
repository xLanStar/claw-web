<script setup>
import APIHelper from "@/helper/APIHelpr.mjs";
import { mdiPencil, mdiTrashCan } from "@mdi/js";
import { computed, ref, useSlots } from "vue";
import Form from "./Form.vue";
import List from "./List.vue";
import Modal from "./Modal.vue";

const slots = useSlots();
const props = defineProps({
  label: String,
  items: Object,
  columns: Array,
  data: Object,
  transformData: Function,
  primaryKey: String,
  dataUrl: String,
  onEditData: {
    type: Function,
    required: false,
  },
  onDeleteData: {
    type: Function,
    required: false,
  },
});

const finalItems = computed(() => {
  const items = Object.assign({}, props.items);
  for (const key of Object.keys(items))
    if (typeof items[key] === "function") items[key] = items[key](props.data);
  return items;
});

const editDialog = ref();
const deleteDialog = ref();

const handleEdit = async (data) => {
  const finalData = props.transformData?.(data) ?? data;
  if (!finalData) {
    editDialog.value = false;
    return;
  }
  if (!props.dataUrl || !props.primaryKey || !props.data[props.primaryKey])
    return;
  return APIHelper.put(
    `${props.dataUrl}/${props.data[props.primaryKey]}`,
    finalData
  )
    .then((data) => {
      return props.onEditData?.(data);
    })
    .then(() => {
      editDialog.value = false;
    });
};
const handleDelete = () =>
  APIHelper.delete(`${props.dataUrl}/${props.data[props.primaryKey]}`)
    .then(() => props.onDeleteData?.())
    .then(() => {
      deleteDialog.value = false;
    });
</script>

<template>
  <v-card>
    <template v-slot:title>
      <div class="d-flex ga-2">
        <v-chip label>{{ label }}</v-chip>
        <slot name="title" />
      </div>
    </template>
    <template v-slot:subtitle>
      <slot name="subtitle" />
    </template>

    <template v-slot:text>
      <List :items="finalItems">
        <template
          v-for="key of Object.keys(finalItems).filter((key) => slots[key])"
          :key="key"
          v-slot:[key]="props"
        >
          <slot :name="key" v-bind="props" />
        </template>
      </List>
      <slot name="text" />
    </template>

    <template v-if="onEditData || onDeleteData || slots.actions" v-slot:actions>
      <div class="d-flex align-center ga-2">
        <v-dialog v-if="onEditData" v-model="editDialog" persistent width="600">
          <template v-slot:activator="{ props }">
            <v-btn :prepend-icon="mdiPencil" v-bind="props"> 編輯 </v-btn>
          </template>
          <Form
            mode="edit"
            :columns="columns"
            :data="data"
            diff-only
            :on-submit-success="handleEdit"
            @cancel="editDialog = false"
          />
        </v-dialog>
        <Modal
          v-if="onDeleteData"
          :show="deleteDialog"
          :toggle="() => (deleteDialog = !deleteDialog)"
          title="確定要刪除？"
          text="刪除後將無法復原！"
          :on-confirm="handleDelete"
        >
          <template v-slot="{ props }">
            <v-btn
              :prepend-icon="mdiTrashCan"
              color="red"
              v-bind="props"
              @click="deleteDialog = true"
            >
              刪除
            </v-btn>
          </template>
        </Modal>
        <slot name="actions" />
      </div>
    </template>
  </v-card>
</template>
