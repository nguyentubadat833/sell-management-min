<script setup lang="ts">
import type {PropType} from "vue";
import type {ICategoryMenuTreeItem} from "~/types/TClient";

const {data} = defineProps({
  data: {
    type: Object as PropType<ICategoryMenuTreeItem>
  }
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <span @click="data?.click" class="cursor-pointer hover:text-gray-600">{{ data?.label }}</span>
    <span v-for="item in data?.children" @click="item.click" class="cursor-pointer hover:text-gray-600">{{item.label}}</span>
  </div>
</template>

<style scoped>

</style>