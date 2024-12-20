<script setup lang="ts">

</script>

<template>
  <UContainer>
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <Icon name="fluent-emoji-flat:handbag" size="30"/>
          <span class="text-xl font-bold">Giỏ hàng</span>
        </div>
      </template>
      <template #default>
        <div class="min-h-[60vh]">

        </div>
      </template>
      <template #footer>
        <div class="flex justify-between items-center">
          <div class="text-gray-600">
            <span class="text-gray-600 dark:text-white font-semibold">Tổng thanh toán: </span>
            <span></span>
          </div>
          <UButton icon="heroicons:currency-dollar-20-solid" label="Thanh toán" color="orange"/>
        </div>
      </template>
    </UCard>
    <div>

    </div>
  </UContainer>
</template>

<style scoped>

</style>