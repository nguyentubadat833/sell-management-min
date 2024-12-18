<script setup lang="ts">
import type {PropType} from "vue";

interface Item {
  label: string,
  icon?: string
  click?: any
  split?: boolean
}

const {dropdownId, items} = defineProps({
  dropdownId: {
    type: String,
    required: true
  },
  items: {
    type: Array as PropType<Item[]>,
    required: true
  }
})
</script>

<template>
  <div>
    <div :id="dropdownId" :data-dropdown-toggle="dropdownId + 'dropdown'">
      <slot name="default"/>
    </div>
    <div :id="dropdownId + 'dropdown'" class="z-10 px-1 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-52 dark:bg-gray-700">
      <div class="py-2 text-sm text-gray-700 dark:text-gray-200" :aria-labelledby="dropdownId">
        <div v-for="item in items"
             @click="!item.split  && typeof item.click === 'function' ? item.click() : null">
          <UDivider v-if="item?.split" :label="item.label" class="p-2"/>
          <div v-else
               class="flex gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
            <Icon v-if="item?.icon" :name="item.icon" size="22"/>
            <div>
              <span >{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>