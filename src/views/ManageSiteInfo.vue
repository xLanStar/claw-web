<script setup>
import Form from "@/components/Form.vue";
import List from "@/components/List.vue";
import Modal from "@/components/Modal.vue";
import RoleChip from "@/components/RoleChip.vue";
import Table from "@/components/Table.vue";
import { InputType } from "@/data/form.mjs";
import { Role } from "@/data/role.mjs";
import { userState } from "@/store/auth.mjs";
import { formatDateTime } from "@/utils/date.utils.mjs";
import { mdiArrowLeft, mdiPencil, mdiTrashCan } from "@mdi/js";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import APIHelper from "../helper/APIHelpr.mjs";
import { MANAGE_MACHINE_URL, MANAGE_SITE_URL } from "../reference.mjs";

const SiteEditColumns = [
  {
    title: "場地名字",
    dataIndex: "sName",
    inputType: InputType.Text,
  },
  {
    title: "場地地址",
    dataIndex: "sAddress",
    inputType: InputType.Text,
  },
];

const MachineAddColumns = [
  {
    title: "機台名字",
    dataIndex: "mName",
    inputType: InputType.Text,
  },
];

const router = useRouter();
const route = useRoute();

const site = ref({});
const editDialog = ref();
const deleteDialog = ref(false);

const submitEdit = async (data) => {
  if (!data) {
    editDialog.value = false;
    return;
  }
  await APIHelper.put(`${MANAGE_SITE_URL}/${route.params.sId}`, data).then(
    (data) => {
      site.value = { ...site.value, ...data };
      editDialog.value = false;
    }
  );
};

const handleDelete = () =>
  APIHelper.delete(`${MANAGE_SITE_URL}/${route.params.sId}`).then(() => {
    deleteDialog.value = false;
    router.go({ name: "ManageSiteList" });
  });

const addMachine = async (data) =>
  APIHelper.post(MANAGE_MACHINE_URL, {
    ...data,
    sId: site.value.sId,
  }).then((data) => {
    site.value.machines.push(data);
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
          {{ site?.sName || "(沒有名字)" }}
        </template>
        <template v-slot:subtitle>
          {{ site?.sId }}
        </template>
        <template v-if="userState.uRole >= Role.Root" v-slot:text>
          <List
            :items="{
              ...(site?.user ? { 擁有者: site.user } : {}),
              地址: site?.sAddress,
              建立時間: formatDateTime(site.createdAt),
            }"
          >
            <template v-slot:擁有者="{ value }">
              <role-chip :role="value?.uRole" />
              {{ value?.uEmail }}
            </template>
          </List>
        </template>
        <template v-slot:actions>
          <div class="d-flex align-center ga-2">
            <v-dialog v-model="editDialog" persistent width="600">
              <template v-slot:activator="{ props }">
                <v-btn :prepend-icon="mdiPencil" v-bind="props"> 編輯 </v-btn>
              </template>
              <Form
                :columns="SiteEditColumns"
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
          </div>
        </template>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <div class="text-h5">機台列表</div>
      <Table
        :items="site?.machines || []"
        :columns="MachineAddColumns"
        :on-add-data="addMachine"
      >
        <template v-slot="item">
          <v-card
            link
            :to="{ name: 'ManageMachineInfo', params: { mId: item.mId } }"
          >
            <template v-slot:title>
              <v-chip label>機台</v-chip>
              {{ item.mName }}
            </template>

            <template v-slot:subtitle>
              {{ item.mId }}
            </template>
          </v-card>
        </template>
      </Table>
    </v-col>
  </v-row>
</template>
