<script setup>
import { QRCodeContentType } from "@/data/qrcodecontent.mjs";
import APIHelper from "@/helper/APIHelpr.mjs";
import { QRCODE_CLAIM_URL } from "@/reference.mjs";
import { showAlert } from "@/store/alert.mjs";
import { ref } from "vue";
import { QrcodeStream } from "vue-qrcode-reader";

const scannedQRCode = ref({});

const claimQRCode = (qriShortId, qriKey) => {
  const index = `${qriShortId}${qriKey}`;
  if (scannedQRCode.value[index]) return;
  scannedQRCode.value[index] = true;
  APIHelper.post(QRCODE_CLAIM_URL, {
    qriShortId,
    qriKey,
  }).then((data) => {
    const message = data
      .map(({ qrcType, qrcCount, qrcData }) => {
        switch (qrcType) {
          case QRCodeContentType.Gold:
            return `金幣 x ${qrcCount}`;
          case QRCodeContentType.Token:
            return `代幣 x ${qrcCount}`;
        }
      })
      .join("、");
    showAlert("success", `您已領取 ${message}`);
    console.log(data);
  });
};

const parseScanURL = (url) => {
  const urlParams = new URL(url).searchParams;
  const t = urlParams.get("t");
  const i = urlParams.get("i");
  const k = urlParams.get("k");
  return [t, i, k];
};
</script>
<template>
  <QrcodeStream
    @detect="
      (result) => {
        console.log(result);
        for (const data of result) {
          const [t, i, k] = parseScanURL(data.rawValue);
          console.log(data, t, i, k);
          if (t === 'q') {
            claimQRCode(i, k);
          }
        }
      }
    "
  />
</template>
