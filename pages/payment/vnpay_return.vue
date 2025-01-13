<script setup lang="ts">

import {EVnpayRsp} from "~/types/IPayment";

const query = useRoute().query
const isValid = computed(() => query?.isValid === 'true')
const message = computed(() => {
  let message: string
  let code = query?.code as string
  if (isValid.value && code) {
    code = `C${code}`
    message = EVnpayRsp[code as keyof typeof EVnpayRsp] || 'Mã phản hồi không hợp lệ';
  } else {
    message = 'Giao dịch không hợp lệ'
  }
  return message
})
</script>

<template>
  <div class="flex items-center gap-2">
    <Icon v-if="isValid" name="mdi:checkbox-marked-circle-outline" size="50" class="text-green-600"/>
    <Icon v-else name="heroicons:exclamation-triangle-16-solid" size="30" class="text-red-500"/>
    <span>{{ message }}</span>
  </div>
</template>

<style scoped>

</style>