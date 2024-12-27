<script setup lang="ts">
import {ECategoryType, type IConsoleCategoryReq} from "~/types/TCategory";

definePageMeta({
  name: 'Category Management'
})

const categoryStatusOptions: {
  label: string,
  value: number
}[] = [
  {label: 'Inactive', value: 0},
  {label: 'Normal', value: 1}
]

const isLoading = ref(false)
const toast = useToast()

const sort = ref({
  column: 'createdAt',
  direction: 'desc'
})

const categoryColumns = [
  {key: 'id', label: 'Id'},
  {key: 'type', label: 'Type'},
  {key: 'name', label: 'Name'},
  {key: 'status', label: 'Status'},
  {key: 'createdAt', label: 'Created At', sortable: true}
]
const initCategoryState: IConsoleCategoryReq = {
  id: '',
  name: '',
  status: 1,
  type: ECategoryType.THREE_D
}

const q = ref('')
const isOpenCategoryModal = ref(false)
const categoryState = reactive<IConsoleCategoryReq>({...initCategoryState})
const {data: categoryData, refresh: refreshCategoryData} = await useFetch('/api/control/category/findMany')
const filteredRows = computed(() => {
  if (isArray(categoryData.value)) {
    if (!q.value) {
      return categoryData.value
    }

    return categoryData.value.filter((category) => {
      return Object.values(category).some((value) => {
        return removeAccents(String(value)).toLowerCase().includes(removeAccents(q.value).toLowerCase())
      })
    })
  } else {
    return []
  }
})

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
  if (!categoryState.name) return
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
    toast.add({title: 'Error', color: "red"})
  }
}

</script>

<template>
  <div class="space-y-7">
    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <UInput v-model="q" placeholder="Filter with name..."/>
    </div>
    <UTable :rows="filteredRows" :columns="categoryColumns" @select="selectCategory" :sort="sort" class="max-h-[70vh]">
      <template #status-data="{row}">
        <span>{{ getStatusLabel(row.status) }}</span>
      </template>
      <template #createdAt-data="{row}">
        <NuxtTime :datetime="row.createdAt" day="numeric" month="numeric" year="numeric"/>
      </template>
    </UTable>
    <div class="flex justify-end">
      <UButton label="Add Category" color="gray" @click="addCategory" :loading="isLoading"/>
    </div>
    <ClientOnly>
      <UModal v-model="isOpenCategoryModal">
        <div class="p-4">
          <UForm :state="categoryState" class="space-y-5" @submit.prevent="saveCategory">
            <UFormGroup label="Id">
              <UInput disabled v-model="categoryState.id"/>
            </UFormGroup>
            <UFormGroup label="Name" :error="!categoryState.name">
              <UInput v-model="categoryState.name" placeholder="Enter category name"/>
            </UFormGroup>
            <UFormGroup label="Type">
              <USelect v-model="categoryState.type" :options="Object.values(ECategoryType)"
                       placeholder="Select a type"/>
            </UFormGroup>
            <UFormGroup label="Parent">
              <USelectMenu
                  v-model="categoryState.parentId"
                  :options="categoryData"
                  placeholder="Select a category"
                  searchable
                  searchable-placeholder="Search by id or name"
                  option-attribute="name"
                  by="id"
                  :search-attributes="['id', 'name']"
              >
                <template #option="{ option: category }">
                  <div class="flex gap-2">
                    <span class="w-24">{{ category.id }}</span>
                    <span>{{ category.name }}</span>
                  </div>
                </template>
              </USelectMenu>
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