<script setup lang="ts">
import type {IProductSearchAndSuggestion} from "~/types/TClient";

interface IProperties {
  publishedAt: string
  purchaseQuantity: number
}

const route = useRoute()
const {product} = route.params
const {data} = await useFetch('/api/client/search/product-alias', {
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
    <div v-if="data?.product" class="md:grid grid-cols-[1fr_2fr] md:gap-5 space-y-7 md:space-y-0">
      <div>
        <UCarousel v-slot="{ item }" :items="data.product.images" :ui="{ item: 'basis-full' }"
                   class="rounded-lg overflow-hidden" arrows>
          <img :src="getProductImageUrl(item)" class="w-full" draggable="false">
        </UCarousel>
      </div>
      <div class="md:flex flex-col justify-between space-y-5">
        <div class="flex flex-col gap-1">
          <span class="text-orange-400 font-medium text-sm cursor-pointer hover:underline"
                @click="navigateTo(`/search/ctg/${data?.product.category.alias}`)">{{
              (data?.product.category.name)?.toUpperCase() || ''
            }}</span>
          <span class="font-bold text-stone-800 dark:text-white text-lg sm:text-xl xl:text-2xl">{{
              data?.product.name
            }}</span>
        </div>
        <div class="flex flex-col justify-between gap-2">
          <div class="group-detail">
            <div class="group-detail-label">Platform:</div>
            <span>3dsMax 2012 + obj</span>
          </div>
          <div class="group-detail">
            <div class="group-detail-label">Render:</div>
            <span>V-Ray</span>
          </div>
          <div class="group-detail">
            <div class="group-detail-label">Size:</div>
            <span>13 MB</span>
          </div>
          <div class="group-detail">
            <div class="group-detail-label">Colors:</div>
            <span></span>
          </div>
          <div class="group-detail">
            <div class="group-detail-label">Style:</div>
            <span></span>
          </div>
          <div class="group-detail">
            <div class="group-detail-label">Materials:</div>
            <span></span>
          </div>
          <div class="group-detail">
            <div class="group-detail-label">Published:</div>
            <NuxtTime class="font-medium text-gray-700" :datetime="data?.product.createdAt " day="numeric"
                      month="numeric" year="numeric" locale="vi-VN"/>
          </div>
        </div>
        <UCard class="shadow-md">
          <div class="md:flex justify-between space-y-5 md:space-y-0">
            <div class="flex items-center justify-center md:justify-start gap-2">
              <Icon name="ic:baseline-payments" size="25" class="text-orange-600"/>
              <span class="md:text-xl text-lg text-orange-600 font-bold">{{
                  formatNumber(data?.product.originalPrice)
                }}</span>
            </div>
            <div class="flex flex-col md:flex-row gap-5">
              <UButton @click="cartInfo().addProduct(data?.product!.id)" label="Thêm vào giỏ"
                       icon="heroicons:plus-20-solid"
                       color="orange" class="flex justify-center md:justify-start"/>
<!--              <UButton label="Mua ngay"-->
<!--                       icon="heroicons:shopping-cart"-->
<!--                       color="lime" class="flex justify-center md:justify-start"/>-->
            </div>
          </div>
        </UCard>
      </div>
    </div>
    <div v-else>
      Không tìm thấy kết quả nào.
    </div>
    <GridProducts v-if="data?.suggestion" divider-label="Liên quan" :products="data.suggestion"/>
  </div>
</template>

<style scoped>
.group-detail {
  @apply flex gap-3;

  .group-detail-label {
    @apply text-gray-500 min-w-20 md:min-w-24
  }
}
</style>