<script setup lang="ts">

import {EVnPayRsp} from "~/types/TPayment";

const query = useRoute().query
const isValid = computed(() => query?.isValid === 'true')
const message = computed(() => {
  let message: string
  let code = query?.code as string
  if (isValid.value && code) {
    code = `C${code}`
    message = EVnPayRsp[code as keyof typeof EVnPayRsp] || 'Mã phản hồi không hợp lệ';
  } else {
    message = 'Giao dịch không hợp lệ'
  }
  return message
})
</script>

<template>
  <div>
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <Icon name="ic:outline-payments" size="25"/>
          <div class="font-bold text-lg">Giao dịch VNPAY</div>
        </div>
      </template>
      <template #default>
        <div class="flex items-center gap-2">
          <Icon v-if="isValid" name="mdi:checkbox-marked-circle-outline" size="40" class="text-green-600"/>
          <Icon v-else name="heroicons:exclamation-triangle-16-solid" size="40" class="text-red-500"/>
          <span class="font-medium">{{ message }}</span>
        </div>
      </template>
    </UCard>
  </div>
</template>

<style scoped>

</style>