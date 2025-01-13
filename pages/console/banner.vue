<script setup lang="ts">
import type {IProductRemoveImage} from "~/types/TProduct";

definePageMeta({
  name: 'Banner Management'
})

const urls = ref([''])
const toast = useToast()
const isLoading = ref(false)
const {handleFileInput, files} = useFileStorage()
const {data: images, refresh} = useFetch('/api/control/banner')

async function upload() {
  isLoading.value = true
  const response = await $fetch('/api/file/banner/upload', {
    method: 'POST',
    body: {
      files: files.value,
      urls: urls.value.filter(Boolean)
    }
  }).finally(() => {
    isLoading.value = false
  })

  if (response) {
    await refresh()
    urls.value = ['']
  }
}

async function removeImage(imageId: number) {
  async function del() {
    const result = await $fetch('/api/file/delete', {
      method: 'DELETE',
      params: {
        imageId: imageId
      } as unknown as IProductRemoveImage
    })
    if (result) {
      await refresh()
      toast.add({title: 'Success'})
    } else {
      toast.add({title: 'Error'})
    }
  }

  toast.add({
    title: 'Delete banner',
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

function setLink(imageId: string, link: string) {

}

</script>

<template>
  <div class="space-y-7">
    <div class="grid grid-cols-5 gap-3">
      <div
          v-for="image in images"
          :key="image.name"
          class="relative group">
        <NuxtImg :src="joinPath('/images', image.location, image.name)" class="w-full h-auto object-cover"/>
        <div class="flex gap-2 mt-2">
          <UInput v-model="image.link" placeholder="Enter link ..." class="w-full"/>
          <UButton label="Save"/>
        </div>
        <Icon @click="removeImage(image.id)"
              class="absolute right-1 top-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-500"
              name="heroicons:x-circle"
              size="30"
        />
      </div>
    </div>
    <UDivider/>
    <div class="w-96 space-y-3">
      <UInput type="file" size="sm" icon="i-heroicons-folder" multiple @input="handleFileInput"/>
      <div class="space-y-3">
        <div v-for="(index) in urls" class="flex gap-2 items-center">
          <UInput v-model="urls[index]" placeholder="Enter url" class="w-full"/>
          <Icon @click="urls.push('')" name="heroicons:plus-20-solid" size="20" v-if="index === urls.length - 1"
                class="cursor-pointer"/>
        </div>
      </div>
      <UButton label="Save" @click="upload" :loading="isLoading" block/>
    </div>
  </div>
</template>

<style scoped>

</style>