<script setup lang="ts">

import type {IProductReq} from "~/types/TProduct";

const sort = ref({
  column: 'category.name',
  direction: 'desc'
})
const productCols = [
  {key: 'name', label: 'Name'},
  {key: 'category.name', label: 'Category Name', sortable: true},
  {key: 'createdAt', label: 'Created At'}
]
const initProductState = {
  id: '',
  name: '',
  category: {} as any
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
  const response = await $fetch('/api/control/product/save', {
    method: 'PUT',
    body: {
      id: productState.id,
      name: productState.name,
      categoryId: productState.category.id
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
<!--      <template #categoryName-data="{row}">-->
<!--        <span>{{ row.category?.name }}</span>-->
<!--      </template>-->
    </UTable>
    <div class="flex justify-end">
      <UButton label="Add Product" color="gray" @click="addProduct" :loading="isLoading"/>
    </div>
    <ClientOnly>
      <UModal v-model="isOpenProductModal">
        <div class="p-4">
          <UForm :state="productState" class="space-y-5" @submit.prevent="saveProduct">
            <UFormGroup label="Name">
              <UInput v-model="productState.name"/>
            </UFormGroup>
            <UFormGroup label="Category">
              <USelectMenu
                  v-model="productState.category"
                  :options="categoryData"
                  placeholder="Select a category"
                  searchable
                  searchable-placeholder="Search by id or name"
                  option-attribute="name"
                  by="id"
                  :search-attributes="['name', 'id']"
              >
                <template #option="{ option: category }">
                  <div class="flex gap-3">
                    <span class="truncate">{{ category.id }}</span>
                    <span class="truncate">{{ category.name }}</span>
                  </div>

                </template>
              </USelectMenu>
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