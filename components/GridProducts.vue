<script setup lang="ts">
import type {IProductSearch} from "~/types/TClient";
import type {PropType} from "vue";

const {products, dividerLabel} = defineProps({
  dividerLabel: {
    type: String
  },
  products: {
    type: Array as PropType<IProductSearch[]>,
    required: true
  }
})
</script>

<template>
  <div class="space-y-7">
    <UDivider v-if="dividerLabel" :label="dividerLabel"/>
    <div class="grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 grid-cols-2 gap-4 md:gap-7">
      <div v-for="product in products" class="border dark:border-gray-700 rounded-lg overflow-hidden">
        <img @click="navigateTo(`/search/prd/${product.alias}`)" v-if="product?.images && isArray(product?.images) && product.images.length > 0"
             :src="joinPath('/images', product?.images[0]?.location, product?.images[0]?.name)" alt="Images"
             class="w-full h-auto border-b dark:border-b-gray-700  cursor-pointer">
        <div class="flex flex-col justify-between p-3 sm:px-4 h-36">
          <span @click="navigateTo(`/search/prd/${product.alias}`)" class="text-xs sm:text-base text-gray-700 dark:text-white line-clamp-2 tracking-wide hover:underline cursor-pointer">{{
              product.name
            }}
          </span>
          <div class="flex flex-col gap-3">
            <div class="flex justify-between">
              <div class="font-bold text-orange-700">
                <span>{{ formatNumber(product?.originalPrice) }}</span>
              </div>
              <div class="flex items-center gap-1 text-gray-600 dark:text-white">
                <Icon name="heroicons:shopping-bag" size="18"/>
                <span>16</span>
              </div>
            </div>
            <UButton @click="cartInfo().addProduct(product.code)" label="Thêm vào giỏ"
                     icon="heroicons:plus-20-solid"
                     color="orange" block/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>