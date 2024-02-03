<script setup>
import Modal from "@/components/Modal.vue";
import APIHelper from "@/helper/APIHelpr.mjs";
import { DRAW_URL, RESOURCE_IMAGE_DRAWPRIZE_URL } from "@/reference.mjs";
import { getHoleStatus } from "@/utils/draw.utils.mjs";
import { mdiClose } from "@mdi/js";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const draw = ref({});
const selectedPosition = ref();
const showModal = ref(false);
const holePrizeMap = computed(() => {
  const map = {};
  if (draw.value.drawprizes) {
    for (const drawprize of draw.value.drawprizes) {
      map[drawprize.dpPosition] = drawprize;
    }
  }
  return map;
});

onMounted(() => {
  APIHelper.get(`${DRAW_URL}/${route.params.dId}`).then(
    (data) => (draw.value = data)
  );
});
</script>
<template>
  <v-row class="text-h5">
    <v-col>
      {{ draw.dName }}
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="8">
      <v-container class="pa-0">
        <v-row>
          <v-col v-for="(_, i) in draw.dHoleCount" cols="auto" class="pa-1">
            <v-card
              link
              style="width: 70px; height: 70px"
              :disabled="getHoleStatus(draw.dStatus, i)"
              @click="
                () => {
                  showModal = true;
                  selectedPosition = i;
                }
              "
            >
              <template v-if="getHoleStatus(draw.dStatus, i)" v-slot:text>
                <div v-if="holePrizeMap[i]" class="text-center">
                  {{ holePrizeMap[i].dpName }}
                </div>
                <v-icon v-else :icon="mdiClose" style="align-self: center" />
              </template>
            </v-card>
          </v-col>
        </v-row>
        <Modal
          :show="showModal"
          persistent
          title="確定要抽這個獎嗎?"
          :on-cancel="() => (showModal = false)"
          :on-confirm="
            () => {
              showModal = false;
              APIHelper.post(DRAW_URL, {
                dId: draw.dId,
                position: selectedPosition,
              });
            }
          "
        >
        </Modal>
      </v-container>
    </v-col>
    <v-col cols="4" class="ga-2">
      <v-container class="pa-0">
        <v-row v-for="(drawprize, idx) of draw.drawprizes" :key="idx">
          <v-col>
            <v-card density="compact">
              <template v-slot:title>
                <v-img
                  :src="`${RESOURCE_IMAGE_DRAWPRIZE_URL}/${drawprize.dpId}`"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey-lighten-5"
                      />
                    </v-row>
                  </template>
                </v-img>
              </template>
              <template v-slot:text>
                {{ drawprize.dpName }}
                <br />
              </template>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>
