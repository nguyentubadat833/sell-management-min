<script setup lang="ts">
const {data: indexData} = await useFetch('/api/client/index-data')
const productParts = computed(() => {
  if (indexData.value) {
    const products = indexData.value.products
    if (products.length > 0) {
      const chunkSize = Math.ceil(products.length / 4);
      return useChunk(products, chunkSize);
    }
  }
  return []
})
console.log(productParts.value)
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
    <UDivider label="Sản phẩm mới nhất"/>
    <div class="grid sm:grid-cols-4 grid-cols-2 gap-4 md:gap-7">
      <div v-for="product in indexData?.products" class="border min-h-80 rounded-lg">
        <img v-if="product?.images && isArray(product?.images) && product.images.length > 0"
             :src="joinPath('/images', product?.images[0]?.location, product?.images[0]?.name)" alt="Images"
             class="w-full h-auto border-b cursor-pointer">
        <div class="flex flex-col gap-3 p-3">
          <span class="text-gray-700 text-sm tracking-wide hover:underline cursor-pointer">{{ product.name }}</span>
          <div class="flex justify-between">
            <span class="text-lg font-bold text-orange-700 tracking-wider">{{ product?.originalPrice }} vnđ</span>
            <div class="flex items-center gap-1 text-gray-600">
              <Icon name="heroicons:shopping-bag" size="18"/>
              <span>16</span>
            </div>
          </div>
          <UButton icon="heroicons:shopping-cart" label="Thêm giỏ hàng" color="orange" block/>
        </div>
      </div>

      <!--      <div class="grid gap-4">-->
      <!--        <div>-->
      <!--          <img class="h-auto max-w-full rounded-lg"-->
      <!--               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg" alt="">-->
      <!--        </div>-->
      <!--        <div>-->
      <!--          <img class="h-auto max-w-full rounded-lg"-->
      <!--               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg" alt="">-->
      <!--        </div>-->
      <!--        <div>-->
      <!--          <img class="h-auto max-w-full rounded-lg"-->
      <!--               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg" alt="">-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="grid gap-4">-->
      <!--        <div>-->
      <!--          <img class="h-auto max-w-full rounded-lg"-->
      <!--               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg" alt="">-->
      <!--        </div>-->
      <!--        <div>-->
      <!--          <img class="h-auto max-w-full rounded-lg"-->
      <!--               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg" alt="">-->
      <!--        </div>-->
      <!--        <div>-->
      <!--          <img class="h-auto max-w-full rounded-lg"-->
      <!--               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg" alt="">-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="grid gap-4">-->
      <!--        <div>-->
      <!--          <img class="h-auto max-w-full rounded-lg"-->
      <!--               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg" alt="">-->
      <!--        </div>-->
      <!--        <div>-->
      <!--          <img class="h-auto max-w-full rounded-lg"-->
      <!--               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg" alt="">-->
      <!--        </div>-->
      <!--        <div>-->
      <!--          <img class="h-auto max-w-full rounded-lg"-->
      <!--               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg" alt="">-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="grid gap-4">-->
      <!--        <div>-->
      <!--          <img class="h-auto max-w-full rounded-lg"-->
      <!--               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg" alt="">-->
      <!--        </div>-->
      <!--        <div>-->
      <!--          <img class="h-auto max-w-full rounded-lg"-->
      <!--               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg" alt="">-->
      <!--        </div>-->
      <!--        <div>-->
      <!--          <img class="h-auto max-w-full rounded-lg"-->
      <!--               src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg" alt="">-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<style scoped>

</style>