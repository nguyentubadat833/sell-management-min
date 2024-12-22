<script setup lang="ts">
import type {IProductSearchAndSuggestion} from "~/types/TClient";

const route = useRoute()
const {product} = route.params
const {data} = await useFetch('/api/client/search-with-product', {
  params: {
    product: product
  },
  transform(value: IProductSearchAndSuggestion) {
    return value
  }
})


console.log(data.value)

</script>

<template>
  <div class="space-y-7">
    <UCard v-if="data?.product">
      <template #header>
        <div class="md:flex justify-between space-y-2">
          <div>
            <span class="font-bold text-stone-800 dark:text-white text-lg sm:text-xl">{{ data?.product.name }}</span>
          </div>
          <div>
            <span class="text-gray-400 italic">Code: {{ data?.product.code }}</span>
          </div>
        </div>
      </template>
      <template #default>
        <div class="md:grid grid-cols-[1fr_2fr] md:gap-5 space-y-7 md:space-y-0">
          <div>
            <UCarousel v-slot="{ item }" :items="data.product.images" :ui="{ item: 'basis-full' }"
                       class="rounded-lg overflow-hidden" arrows>
              <img :src="getProductImageUrl(item)" class="w-full" draggable="false">
            </UCarousel>
          </div>
          <div>
            <div class="flex flex-col justify-between h-full gap-7">
              <div class="flex flex-col gap-5 text-sm md:text-base">
                <div class="flex gap-3">
                  <div class="text-gray-400 min-w-28 md:min-w-32">Danh mục:</div>
                  <span class="text-orange-400 font-medium">{{ data?.product.category.name }}</span>
                </div>
                <div class="flex gap-3">
                  <div class="text-gray-400 min-w-28 md:min-w-32">Ngày xuất bản:</div>
                  <NuxtTime class="font-medium text-gray-700" :datetime="data?.product.createdAt " day="numeric"
                            month="numeric" year="numeric" locale="vi-VN"/>
                </div>
                <div class="flex gap-3">
                  <div class="text-gray-400 min-w-28 md:min-w-32">Lượt mua:</div>
                  <span class="font-medium text-gray-700">16</span>
                </div>
                <div class="flex gap-3">
                  <div class="text-gray-400 min-w-28 md:min-w-32">Mô tả:</div>
                  <span class="font-medium text-gray-700">...</span>
                </div>
              </div>
              <div>
                <UCard class="shadow-md">
                  <div class="md:flex justify-between space-y-5 md:space-y-0">
                    <div class="flex items-center justify-center md:justify-start gap-2">
                      <Icon name="heroicons:arrow-down-circle-20-solid" size="25" class="text-orange-600"/>
                      <span class="md:text-xl text-lg text-orange-600 font-bold">{{
                          formatNumber(data?.product.originalPrice)
                        }}</span>
                    </div>
                    <div class="flex flex-col md:flex-row gap-5">
                      <UButton @click="cartInfo().addProduct(data?.product!.code)" label="Thêm vào giỏ"
                               icon="heroicons:plus-20-solid"
                               color="orange" class="flex justify-center md:justify-start"/>
                      <UButton label="Mua ngay"
                               icon="heroicons:shopping-cart"
                               color="lime" class="flex justify-center md:justify-start"/>
                    </div>
                  </div>
                </UCard>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UCard>
    <div v-else>
      Không tìm thấy kết quả nào.
    </div>
    <GridProducts v-if="data?.suggestion" divider-label="Liên quan" :products="data.suggestion"/>
  </div>
</template>

<style scoped>

</style>