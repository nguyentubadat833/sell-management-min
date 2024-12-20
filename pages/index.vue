<script setup lang="ts">
const {data: indexData} = await useFetch('/api/client/index-data')
// const productParts = computed(() => {
//   if (indexData.value) {
//     const products = indexData.value.products
//     if (products.length > 0) {
//       const chunkSize = Math.ceil(products.length / 4);
//       return useChunk(products, chunkSize);
//     }
//   }
//   return []
// })

const toast = useToast()
const carouselRef = ref()
const productInCart = ref<string[]>([])

function addProductToCart(productCode: string) {
  productInCart.value = cartInfo().getProducts()
  if (productInCart.value.includes(productCode)){
    toast.add({title: 'Đã có trong giỏ hàng', color: 'blue', timeout: 2000})
  }else {
    cartInfo().addProduct(productCode)
    countCartProducts.value = cartInfo().countProducts()
    toast.add({title: 'Đã thêm vào giỏ hàng', timeout: 1000})
  }
}

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
    <div class="grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 grid-cols-2 gap-4 md:gap-7">
      <div v-for="product in indexData?.products" class="border dark:border-gray-700 rounded-lg overflow-hidden">
        <img v-if="product?.images && isArray(product?.images) && product.images.length > 0"
             :src="joinPath('/images', product?.images[0]?.location, product?.images[0]?.name)" alt="Images"
             class="w-full h-auto border-b dark:border-b-gray-700  cursor-pointer">
        <div class="flex flex-col justify-between p-3 sm:px-4 h-36">
          <span class="text-gray-700 dark:text-white text-sm line-clamp-2 tracking-wide hover:underline cursor-pointer">{{
              product.name
            }}
          </span>
          <div class="flex flex-col gap-3">
            <div class="flex justify-between">
              <div class="sm:text-lg font-bold text-orange-700 tracking-wider">
                <span>{{ formatNumber(product?.originalPrice) }}</span>
                <span class="text-sm sm:text-base"> vnđ</span>
              </div>
              <div class="flex items-center gap-1 text-gray-600 dark:text-white">
                <Icon name="heroicons:shopping-bag" size="18"/>
                <span>16</span>
              </div>
            </div>
            <UButton @click="addProductToCart(product?.code)" label="Thêm vào giỏ"
                     icon="heroicons:shopping-cart"
                     color="orange" block/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>