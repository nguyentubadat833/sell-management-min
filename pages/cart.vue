<script setup lang="ts">

import type {ICartDataReq, ICartDataRes} from "~/types/TClient";

const toast = useToast()
const cartData = ref<ICartDataRes>()
const selectedProducts = ref<{ code: string, originalPrice: number }[]>([])
const sumPrice = computed(() => {
  const arrayPrice = selectedProducts.value.map(product => {
    return product?.originalPrice
  })
  return formatNumber(useSum(arrayPrice))
})

async function getProducts() {
  cartData.value = await $fetch('/api/client/cart/load', {
    method: 'POST',
    body: {
      productIdList: cartInfo().getProducts()
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

function changeCheckBox(value: any, product: any) {
  if (value === true) {
    selectedProducts.value.push({
      code: product.code,
      originalPrice: product.originalPrice
    })
  } else {
    selectedProducts.value.splice(selectedProducts.value.findIndex(e => e.code == product.code), 1)
  }
}

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
        <div class="min-h-[50vh] max-h-[60vh] overflow-hidden overflow-y-auto">
          <div v-for="(product, index) in cartData?.products">
            <div class="flex justify-between items-center">
              <label class="flex items-center sm:h-32 h-16 w-8">
                <UCheckbox @change="changeCheckBox($event, product)"/>
              </label>
              <div class="flex gap-2 w-full">
                <div
                    class="sm:w-32 w-16 aspect-auto flex-shrink-0 overflow-hidden flex justify-center items-center border dark:border-gray-600">
                  <NuxtImg :src="getImageProductUrl(product)"
                           class="w-full object-cover"/>
                </div>
                <div class="flex flex-col justify-between w-full">
                      <span @click="navigateTo(`/search/prd/${product.alias}`)"
                          class="md:text-base text-xs text-gray-700 dark:text-white font-medium cursor-pointer hover:underline">{{
                          product.name
                        }}</span>
                  <div class="flex items-end justify-between mr-2">
                        <span class="text-orange-600 font-bold tracking-wider">{{
                            formatNumber(product?.originalPrice)
                          }}</span>
                    <UButton icon="heroicons:x-circle" color="red" @click="removeProduct(product.id)"
                             variant="ghost"/>
                  </div>
                </div>
              </div>
            </div>
            <UDivider v-if="index < cartData?.products?.length - 1" class="my-4"/>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between items-center">
          <div class="text-gray-600">
            <span class="text-gray-600 dark:text-white font-semibold">Tổng thanh toán: {{ sumPrice }}</span>
            <span></span>
          </div>
          <UButton label="Tiến hành mua hàng" color="orange"/>
        </div>
      </template>
    </UCard>
  </div>
</template>

<style scoped>

</style>