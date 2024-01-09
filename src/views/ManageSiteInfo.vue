<script setup>
import Form from "@/components/Form.vue";
import Modal from "@/components/Modal.vue";
import RoleChip from "@/components/RoleChip.vue";
import Table from "@/components/Table.vue";
import { InputType } from "@/data/form.mjs";
import { Role } from "@/data/role.mjs";
import { userState } from "@/store/auth.mjs";
import { mdiArrowLeft, mdiPencil, mdiTrashCan } from "@mdi/js";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import APIHelper from "../helper/APIHelpr.mjs";
import { MANAGE_SITE_URL } from "../reference.mjs";

const columns = [
  {
    title: "場地地址",
    dataIndex: "sAddress",
    inputType: InputType.Text,
  },
];

const router = useRouter();
const route = useRoute();

const site = ref({});
const editDialog = ref();
const deleteDialog = ref(false);

const submitEdit = async (data) => {
  if (!Object.keys(data).length) {
    editDialog.value = false;
    return;
  }
  await APIHelper.put(`${MANAGE_SITE_URL}/${route.params.sId}`, data).then(
    (data) => {
      site.value = data;
      editDialog.value = false;
    }
  );
};

const handleDelete = () =>
  APIHelper.delete(`${MANAGE_SITE_URL}/${route.params.sId}`).then(() => {
    deleteDialog.value = false;
    router.go(-1);
  });

onMounted(() => {
  APIHelper.get(`${MANAGE_SITE_URL}/${route.params.sId}`).then(
    (data) => (site.value = data)
  );
});
</script>

<template>
  <v-row>
    <v-col>
      <v-btn :icon="mdiArrowLeft" @click="$router.go(-1)"> </v-btn>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-card color="primary">
        <template v-slot:title>
          <v-chip label> 場地 </v-chip>
          {{ site?.sAddress }}
        </template>
        <template v-slot:subtitle>
          {{ site?.sId }}
        </template>
        <template v-if="userState === Role.Root" v-slot:text>
          <RoleChip :role="site?.user?.uRole || '未知'" />
          {{ site?.uId }}
        </template>
        <template v-slot:actions>
          <div class="d-flex align-center ga-2">
            <v-dialog v-model="editDialog" persistent width="600">
              <template v-slot:activator="{ props }">
                <v-chip :prepend-icon="mdiPencil" v-bind="props"> 編輯 </v-chip>
              </template>
              <Form
                :columns="columns"
                :data="site"
                diff-only
                :on-submit-success="submitEdit"
                @cancel="editDialog = false"
              />
            </v-dialog>
            <Modal
              :show="deleteDialog"
              :toggle="() => (deleteDialog = !deleteDialog)"
              title="確定要刪除？"
              text="刪除後將無法復原！"
              :on-confirm="handleDelete"
            >
              <template v-slot="{ props }">
                <v-chip
                  :prepend-icon="mdiTrashCan"
                  color="red"
                  v-bind="props"
                  @click="deleteDialog = true"
                >
                  刪除
                </v-chip>
              </template>
            </Modal>
          </div>
        </template>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <div class="text-h5">機台列表</div>
      <Table
        :items="site?.machines"
        :columns="[{ title: 'test', dataIndex: 'test' }]"
        @add-data="(v) => console.log(v)"
      >
        <template v-slot="{ item }">
          <v-card
            link
            :to="{ name: 'ManageMachineInfo', params: { mId: item.raw.mId } }"
          >
            <template v-slot:title>
              <v-chip label>機台</v-chip>
              {{ item.raw.mId }}
            </template>

            <template v-slot:subtitle>
              {{ item.raw.mName }}
            </template>
          </v-card>
        </template>
      </Table>
    </v-col>
  </v-row>
</template>
