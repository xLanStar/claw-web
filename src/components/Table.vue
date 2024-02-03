<script setup>
import Form from "@/components/Form.vue";
import { mdiMagnify, mdiPlus } from "@mdi/js";
import { ref } from "vue";

const props = defineProps({
  items: Array,
  columns: Array,
  onAddData: Function,
});

const search = ref("");
const addDialog = ref(false);

const onSubmitAdd = async (v) =>
  props.onAddData(v)?.then?.(() => {
    addDialog.value = false;
  });
</script>

<template>
  <v-card>
    <v-card-title class="d-flex align-center pe-2 ga-2">
      <v-text-field
        v-model="search"
        density="comfortable"
        hide-details
        placeholder="搜尋"
        :prepend-inner-icon="mdiMagnify"
        style="max-width: 300px"
        variant="solo"
        flat
      />
      <slot name="prepend-title" />

      <v-spacer />

      <slot name="append-title" />

      <v-dialog
        v-if="props.onAddData"
        v-model="addDialog"
        persistent
        width="600"
      >
        <template v-slot:activator="{ props }">
          <v-btn flat text="新增" :prepend-icon="mdiPlus" v-bind="props" />
        </template>
        <Form
          mode="add"
          :columns="columns"
          diff-only
          @cancel="addDialog = false"
          :on-submit-success="onSubmitAdd"
        />
      </v-dialog>
    </v-card-title>

    <v-data-iterator :items="items" :items-per-page="12" :search="search">
      <template v-slot:default="{ items }">
        <v-container class="pa-0" fluid>
          <v-row dense>
            <v-col
              v-for="(item, i) in items"
              :key="i"
              cols="12"
              md="6"
              lg="4"
              xl="3"
            >
              <slot v-bind="item.raw" />
            </v-col>
          </v-row>
        </v-container>
      </template>

      <template v-slot:footer="{ page, pageCount }">
        <v-pagination :model-value="page" :length="pageCount" />
      </template>
    </v-data-iterator>
  </v-card>
</template>
