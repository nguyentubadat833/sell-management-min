<script setup lang="ts">
import type {ICategoryReq} from "~/types/TCategory";

const tabItems = [{
  slot: 'category',
  label: 'Category'
}, {
  slot: 'categoryTree',
  label: 'Category Tree'
}]
const isLoading = ref(false)
const toast = useToast()


// Category
const categoryColumns = [
  {key: 'name', label: 'Name'},
  {key: 'status', label: 'Status'},
  {key: 'createdAt', label: 'Created At'}
]
const categoryStatusOptions = [
  {label: 'Inactive', value: 0},
  {label: 'Normal', value: 1}
]

const initCategoryState: ICategoryReq = {
  id: NaN,
  name: '',
  status: NaN
}
const categoryState = reactive<ICategoryReq>({...initCategoryState})
const isOpenCategoryModal = ref(false)
const {data: categoryData, refresh: refreshCategoryData} = await useFetch('/api/control/category/findMany')

function getStatusLabel(status: number) {
  const find = categoryStatusOptions.find(e => e.value === status)
  if (find) {
    return find.label
  } else {
    return 'unknown'
  }
}

function selectCategory(data: any) {
  useAssign(categoryState, data)
  isOpenCategoryModal.value = true
}

function addCategory() {
  useAssign(categoryState, initCategoryState)
  isOpenCategoryModal.value = true
}

async function saveCategory() {
  isLoading.value = true
  const response = await $fetch('/api/control/category/save', {
    method: 'PUT',
    body: categoryState
  }).finally(() => {
    isLoading.value = false
  })
  if (response) {
    toast.add({title: 'Success'})
    await refreshCategoryData()
    isOpenCategoryModal.value = false
  } else {
    toast.add({title: 'Error'})
  }
}


</script>

<template>
  <div>
    <UTabs :items="tabItems" class="w-full">
      <template #category>
        <UCard>
          <UTable :rows="categoryData" :columns="categoryColumns" @select="selectCategory">
            <template #status-data="{row}">
              <span>{{getStatusLabel(row.status)}}</span>
            </template>
            <template #createdAt-data="{row}">
              <NuxtTime :datetime="row.createdAt" day="numeric" month="numeric" year="numeric"/>
            </template>
          </UTable>
          <div class="flex justify-end">
            <UButton label="Add Category" color="gray" @click="addCategory" :loading="isLoading"/>
          </div>
        </UCard>
      </template>
      <template #categoryTree>
        categoryTree
      </template>
    </UTabs>
    <ClientOnly>
      <UModal v-model="isOpenCategoryModal">
        <div class="p-4">
          <UForm :state="categoryState" class="space-y-5" @submit.prevent="saveCategory">
            <UFormGroup label="Name">
              <UInput v-model="categoryState.name"/>
            </UFormGroup>
            <UFormGroup label="Status">
              <USelect v-model="categoryState.status" :options="categoryStatusOptions" option-attribute="label"
                       value-attribute="value"/>
            </UFormGroup>
            <div class="flex justify-end">
              <UButton label="Submit" type="submit"/>
            </div>
          </UForm>
        </div>
      </UModal>
    </ClientOnly>
  </div>
</template>

<style scoped>

</style>