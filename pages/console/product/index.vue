<script setup lang="ts">

import type {IConsoleProductReq, IProductRemoveImage} from "~/types/TProduct";

definePageMeta({
  name: 'Product Management'
})

const statusOptions: {
  label: string,
  value: number
}[] = [
  {label: 'Inactive', value: 0},
  {label: 'Normal', value: 1}
]
const sort = ref({
  column: 'createdAt',
  direction: 'desc'
})
const productCols = [
  {key: 'name', label: 'Name'},
  {key: 'category.name', label: 'Category Name'},
  {key: 'originalPrice', label: 'Original Price', sortable: true},
  {key: 'createdAt', label: 'Created At', sortable: true},
  {key: 'status', label: 'Status'}
]
const initProductState = {
  id: '',
  name: '',
  category: {} as any,
  originalPrice: 0,
  status: NaN,
  images: [] as { name: string, location: string }[],
}

const {handleFileInput, files} = useFileStorage()
const q = ref('')
const urls = ref([''])
const toast = useToast()
const isOpenProductModal = ref(false)
const isLoading = ref(false)
const productState = reactive({...initProductState})
const {data: productData, refresh: refreshProductData} = await useFetch('/api/control/product/findMany')
const {data: categoryData} = await useFetch('/api/control/category/findMany', {
  transform(input: any[]) {
    return input.filter(e => e.status === 1)
  }
})
console.log(categoryData.value)
const filteredProductRows = computed(() => {
  if (isArray(productData.value)) {
    if (!q.value) {
      return productData.value
    }

    return productData.value.filter((category) => {
      return Object.values(category).some((value) => {
        return removeAccents(String(value)).toLowerCase().includes(removeAccents(q.value).toLowerCase())
      })
    })
  } else {
    return []
  }
})

function getStatusLabel(status: number) {
  const find = statusOptions.find(e => e.value === status)
  if (find) {
    return find.label
  } else {
    return 'unknown'
  }
}

function addProduct() {
  useAssign(productState, initProductState)
  urls.value = ['']
  isOpenProductModal.value = true
}

async function saveProduct() {
  if (!productState.name || !productState.category?.id) return
  let images: string[] = []
  isLoading.value = true
  if (files.value.length > 0 || urls.value.length > 0) {
    const response = await $fetch('/api/file/product/upload', {
      method: 'POST',
      body: {
        files: files.value,
        urls: urls.value.filter(Boolean)
      }
    })
    if (response.length > 0) {
      images = [...response]
    }
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
    } as IConsoleProductReq
  }).finally(() => {
    isLoading.value = false
  })

  if (response) {
    await refreshProductData()
    toast.add({title: 'Success', timeout: 1000})
    useAssign(productState, initProductState)
    urls.value = ['']
    isOpenProductModal.value = false
  } else {
    toast.add({title: 'Error', color: "red"})
  }
}

function selectProduct(data: any) {
  useAssign(productState, data)
  console.log(productState)
  isOpenProductModal.value = true
}

async function removeImage(imageName: string) {
  async function del() {
    const result = await $fetch('/api/file/delete', {
      method: 'DELETE',
      params: {
        productId: productState.id,
        imageName: imageName
      } as IProductRemoveImage
    })
    if (result) {
      const index = productState.images.findIndex(e => e.name === imageName)
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
  <div class="space-y-7">
    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <UInput v-model="q" placeholder="Filter with name..."/>
    </div>
    <UTable :rows="filteredProductRows" :columns="productCols" @select="selectProduct" :sort="sort"
            class="max-h-[70vh]">
      <template #originalPrice-data="{row}">
        <span>{{ Intl.NumberFormat('vi-VN').format(row.originalPrice) }}</span>
      </template>
      <template #status-data="{row}">
        <span>{{ getStatusLabel(row.status) }}</span>
      </template>
      <template #createdAt-data="{row}">
        <NuxtTime :datetime="row.createdAt" day="numeric" month="numeric" year="numeric"/>
      </template>
    </UTable>
    <div class="flex justify-end">
      <UButton label="Add Product" color="gray" @click="addProduct"/>
    </div>
    <ClientOnly>
      <UModal v-model="isOpenProductModal">
        <div class="p-4">
          <UForm :state="productState" class="space-y-5" @submit.prevent="saveProduct">
            <UFormGroup label="Id">
              <UInput disabled v-model="productState.id"/>
            </UFormGroup>
            <UFormGroup label="Name" :error="!productState.name">
              <UInput v-model="productState.name" placeholder="Enter product name"/>
            </UFormGroup>
            <UFormGroup label="Category" :error="!productState.category?.id">
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
<!--                    <span class="font-medium text-gray-400,">{{category.type}}</span>-->
                    <span class="truncate w-24">{{ category.id }}</span>
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
                  <Icon @click="removeImage(image.name)"
                        class="absolute right-1 top-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        name="heroicons:x-circle"
                        size="30"
                  />
                </div>
              </div>

              <UInput type="file" size="sm" icon="i-heroicons-folder" multiple @input="handleFileInput" class="mb-3"/>
              <div class="space-y-3">
                <div v-for="(url, index) in urls" class="flex gap-2 items-center">
                  <UInput v-model="urls[index]" placeholder="Enter url" class="w-full"/>
                  <Icon @click="urls.push('')" name="heroicons:plus-20-solid" size="20" v-if="index === urls.length - 1"
                        class="cursor-pointer"/>
                </div>
              </div>

            </UFormGroup>
            <div class="flex justify-end">
              <UButton label="Submit" type="submit" :loading="isLoading"/>
            </div>
          </UForm>
        </div>
      </UModal>
    </ClientOnly>
  </div>
</template>