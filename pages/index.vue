<script setup lang="ts">
import type {IIndexData} from "~/types/TClient";

const {data: indexData} = await useFetch('/api/client/index-data')

const carouselRef = ref()

onMounted(() => {
  setInterval(() => {
    if (!carouselRef.value) return

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0)
    }

    carouselRef.value.next()
  }, 3000)
})

</script>

<template>
  <div class="space-y-7">
    <UCarousel v-if="indexData?.banner"
        ref="carouselRef"
        v-slot="{ item }"
        :items="indexData?.banner"
        :ui="{ item: 'basis-full' }"
        class="rounded-lg overflow-hidden !z-30"
        indicators
    >
      <img :src="joinPath('/images', item?.location, item?.name)" class="w-full" draggable="false" alt="Image">
    </UCarousel>
<!--    <UDivider label="Bản vẽ tốt nhất"/>-->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="grid gap-4">
        <div>
          <img class="h-auto max-w-full rounded-lg"
               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg" alt="">
        </div>
        <div>
          <img class="h-auto max-w-full rounded-lg"
               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg" alt="">
        </div>
        <div>
          <img class="h-auto max-w-full rounded-lg"
               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg" alt="">
        </div>
      </div>
      <div class="grid gap-4">
        <div>
          <img class="h-auto max-w-full rounded-lg"
               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg" alt="">
        </div>
        <div>
          <img class="h-auto max-w-full rounded-lg"
               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg" alt="">
        </div>
        <div>
          <img class="h-auto max-w-full rounded-lg"
               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg" alt="">
        </div>
      </div>
      <div class="grid gap-4">
        <div>
          <img class="h-auto max-w-full rounded-lg"
               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg" alt="">
        </div>
        <div>
          <img class="h-auto max-w-full rounded-lg"
               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg" alt="">
        </div>
        <div>
          <img class="h-auto max-w-full rounded-lg"
               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg" alt="">
        </div>
      </div>
      <div class="grid gap-4">
        <div>
          <img class="h-auto max-w-full rounded-lg"
               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg" alt="">
        </div>
        <div>
          <img class="h-auto max-w-full rounded-lg"
               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg" alt="">
        </div>
        <div>
          <img class="h-auto max-w-full rounded-lg"
               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>