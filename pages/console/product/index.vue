<script setup lang="ts">

import type {IProductReq} from "~/types/TProduct";

const statusOptions: {
  label: string,
  value: number
}[] = [
  {label: 'Inactive', value: 0},
  {label: 'Normal', value: 1}
]
const sort = ref({
  column: 'category.name',
  direction: 'desc'
})
const productCols = [
  {key: 'name', label: 'Name'},
  {key: 'category.name', label: 'Category Name', sortable: true},
  {key: 'originalPrice', label: 'Original Price'},
  {key: 'createdAt', label: 'Created At'}
]
const initProductState = {
  id: '',
  name: '',
  category: {} as any,
  originalPrice: 0,
  status: NaN
}

const toast = useToast()
const isOpenProductModal = ref(false)
const isLoading = ref(false)
const productState = reactive({...initProductState})
const {data: productData, refresh: refreshProductData} = await useFetch('/api/control/product/findMany')
const {data: categoryData} = await useFetch('/api/control/category/findMany')

function addProduct() {
  useAssign(productState, initProductState)
  isOpenProductModal.value = true
}

async function saveProduct() {
  if (!productState.name || !productState.category?.id) return
  const response = await $fetch('/api/control/product/save', {
    method: 'PUT',
    body: {
      id: productState.id,
      name: productState.name,
      categoryId: productState.category.id,
      originalPrice: productState?.originalPrice,
      status: productState?.status
    } as IProductReq
  })
  if (response) {
    await refreshProductData()
    toast.add({title: 'Success'})
    isOpenProductModal.value = false
  } else {
    toast.add({title: 'Error', color: "red"})
  }
}

function selectProduct(data: any) {
  useAssign(productState, data)
  isOpenProductModal.value = true
}

</script>
<template>
  <div>
    <UTable :rows="productData" :columns="productCols" @select="selectProduct" :sort="sort">
      <template #createdAt-data="{row}">
        <NuxtTime :datetime="row.createdAt" day="numeric" month="numeric" year="numeric"/>
      </template>
    </UTable>
    <div class="flex justify-end">
      <UButton label="Add Product" color="gray" @click="addProduct" :loading="isLoading"/>
    </div>
    <ClientOnly>
      <UModal v-model="isOpenProductModal">
        <div class="p-4">
          <UForm :state="productState" class="space-y-5" @submit.prevent="saveProduct">
            <UFormGroup label="Name" :error="!productState.name">
              <UInput v-model="productState.name" placeholder="Enter product name"/>
            </UFormGroup>
            <UFormGroup label="Category" :error="!productState.category?.id">
              <USelectMenu
                  v-model="productState.category"
                  :options="categoryData"
                  placeholder="Select a category"
                  searchable
                  searchable-placeholder="Search by code or name"
                  option-attribute="name"
                  by="id"
                  :search-attributes="['name', 'code']"
              >
                <template #option="{ option: category }">
                  <div class="flex gap-3">
                    <span class="truncate">{{ category.code }}</span>
                    <span class="truncate">{{ category.name }}</span>
                  </div>
                </template>
              </USelectMenu>
            </UFormGroup>
            <UFormGroup label="Original Price">
              <UInput v-model="productState.originalPrice" type="number"/>
            </UFormGroup>
            <UFormGroup label="Status">
              <USelect v-model="productState.status" :options="statusOptions" option-attribute="label"
                       value-attribute="value"/>
            </UFormGroup>
            <div class="flex justify-between">
              <UButton label="Submit" type="submit"/>
            </div>
          </UForm>
        </div>
      </UModal>
    </ClientOnly>
  </div>
</template>