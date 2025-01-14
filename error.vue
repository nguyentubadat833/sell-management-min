<script setup lang="ts">
import type {NuxtError} from '#app'

const {error} = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({redirect: '/'})
</script>

<template>
  <div class="h-screen flex justify-center items-center px-5">
    <UCard class="w-96">
      <template #header>
        <div class="flex justify-center ">
          <span class="text-3xl font-bold">{{ error?.statusCode }}</span>
        </div>
      </template>
      <template #default>
        <div class="flex flex-col gap-7">
          <span class="text-2xl text-center"> {{ error?.statusMessage }}</span>
<!--          <span class="text-xl text-center"> {{ error?.message }}</span>-->
          <UButton @click="handleError" color="gray" block>Về trang chủ</UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
