<script setup>
import { QrcodeStream } from "vue-qrcode-reader";
</script>
<template>
  <QrcodeStream
    @detect="
      (v) => {
        console.log(v);
      }
    "
  ></QrcodeStream>
</template>
