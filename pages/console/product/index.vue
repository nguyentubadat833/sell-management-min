<script setup lang="ts">

import type {IProductRemoveImage, IProductReq} from "~/types/TProduct";

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
  id: NaN,
  name: '',
  category: {} as any,
  originalPrice: 0,
  status: NaN,
  images: [] as { id: number, name: string, location: string }[],
}

const {handleFileInput, files} = useFileStorage()
const toast = useToast()
const isOpenProductModal = ref(false)
const isLoading = ref(false)
const productState = reactive({...initProductState})
const {data: productData, refresh: refreshProductData} = await useFetch('/api/control/product/findMany')
const {data: categoryData} = await useFetch('/api/control/category/findMany')

console.log(productData.value)

function addProduct() {
  useAssign(productState, initProductState)
  isOpenProductModal.value = true
}

async function saveProduct() {
  if (!productState.name || !productState.category?.id) return
  let images: number[] = []
  if (files.value.length > 0) {
    const response = await $fetch('/api/file/product/upload', {
      method: 'POST',
      body: {
        files: files.value
      }
    })
    if (response.length > 0) {
      images = [...response]
    }
    console.log(images)
  }
  const response = await $fetch('/api/control/product/save', {
    method: 'PUT',
    body: {
      id: productState.id,
      name: productState.name,
      categoryId: productState.category.id,
      originalPrice: productState?.originalPrice,
      status: productState?.status,
      images: images
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

async function removeImage(imageId: number) {
  async function del() {
    const result = await $fetch('/api/file/delete', {
      method: 'DELETE',
      params: {
        productId: productState.id,
        imageId: imageId
      } as IProductRemoveImage
    })
    if (result) {
      const index = productState.images.findIndex(e => e.id === imageId)
      productState.images.splice(index, 1)
      toast.add({title: 'Success'})
    } else {
      toast.add({title: 'Error'})
    }
  }

  toast.add({
    title: 'Delete image',
    actions: [
      {
        label: 'No',
      },
      {
        label: 'Yes',
        click: async () => await del()
      }
    ]
  })
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
                    <span class="truncate w-24">{{ category.code }}</span>
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
            <UFormGroup label="Images">
              <!--              <div class="grid grid-cols-4 auto-rows-[1fr] gap-2 mb-3 mt-1">-->
              <!--                <NuxtImg-->
              <!--                    v-for="image in productState.images"-->
              <!--                    :src="`/images/product/${image.name}`"-->
              <!--                    class="w-full h-full object-cover"-->
              <!--                />-->
              <!--              </div>-->
              <div class="grid grid-cols-3 gap-2 mb-3 mt-2 max-h-60 overflow-hidden overflow-y-auto">
                <div
                    v-for="image in productState.images"
                    :key="image.name"
                    class="relative group">
                  <NuxtImg :src="joinPath('/images', image.location, image.name)" class="w-full h-auto object-cover"/>
                  <Icon @click="removeImage(image.id)"
                        class="absolute right-1 top-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        name="heroicons:x-circle"
                        size="30"
                  />
                </div>
              </div>

              <UInput type="file" size="sm" icon="i-heroicons-folder" multiple @input="handleFileInput"/>
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