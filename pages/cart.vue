<script setup lang="ts">

import type {ICartDataReq, ICartDataRes} from "~/types/TClient";

const toast = useToast()
const cartData = ref<ICartDataRes>()
const sumPrice = computed(() => {
  if (cartData.value && cartData.value?.products) {
    const arrayPrice = cartData.value?.products.map(product => {
      return product?.originalPrice
    })
    return formatNumber(useSum(arrayPrice))
  }
  return 0

})

async function getProducts() {
  cartData.value = await $fetch('/api/client/cart-data', {
    method: 'POST',
    body: {
      productCodeList: cartInfo().getProducts()
    } as ICartDataReq
  })
}

function getImageProductUrl(product: any) {
  const image = product?.images[0]
  if (image) {
    return joinPath('/images', image.location, image.name)
  } else {
    return ''
  }
}

function removeProduct(code: string) {
  if (code) {
    toast.add({
      color: 'red',
      title: 'Delete',
      actions: [
        {
          label: 'No'
        },
        {
          label: 'Yes',
          click: async () => {
            cartInfo().removeProduct(code)
            countCartProducts.value = cartInfo().countProducts()
            await getProducts()
          }
        }
      ]
    })
  }

}

onBeforeMount(async () => {
  await getProducts()
})

</script>

<template>
  <div>
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <Icon name="fluent-emoji-flat:handbag" size="30"/>
          <span class="text-xl font-bold">Giỏ hàng</span>
        </div>
      </template>
      <template #default>
        <div class="min-h-[50vh]">
          <div>
            <div v-for="(product, index) in cartData?.products">
              <div class="flex justify-between gap-2">
                <div>
                  <div class="flex gap-2">
                    <NuxtImg :src="getImageProductUrl(product)"
                             class="border dark:border-gray-600 border-1 w-32 overflow-hidden"/>
                    <span class="md:text-base text-sm text-gray-700 dark:text-white font-medium max-w-96">{{
                        product.name
                      }}</span>
                  </div>
                </div>
                <div class="flex flex-col items-end justify-between">
                  <span class="text-orange-600 font-bold tracking-wider">{{
                      formatNumber(product?.originalPrice)
                    }}</span>
                  <UButton icon="heroicons:x-circle" color="red" @click="removeProduct(product.code)"/>
                </div>

              </div>
              <UDivider v-if="index < cartData?.products?.length - 1" class="my-4"/>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between items-center">
          <div class="text-gray-600">
            <span class="text-gray-600 dark:text-white font-semibold">Tổng thanh toán: {{ sumPrice }}</span>
            <span></span>
          </div>
          <UButton icon="heroicons:currency-dollar-20-solid" label="Thanh toán" color="orange"/>
        </div>
      </template>
    </UCard>
  </div>
</template>

<style scoped>

</style>