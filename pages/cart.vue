<script setup lang="ts">
import type {ICartDataReq, ICartDataRes} from "~/types/TClient";

const {data: authData} = useAuth()
const toast = useToast()
const isErrorMessage = ref(false)
const cartData = ref<ICartDataRes>()
const arrayPrice = computed(() => {
  return cartData.value?.products?.filter(e => e.selectedOrder && e.orderQuantity && e.orderQuantity > 0)
      .map(product => {
        return product?.originalPrice
      })
})
const formatTotalPrice = computed(() => {
  return formatNumber(useSum(arrayPrice.value))
})

async function getProducts() {
  cartData.value = await $fetch('/api/client/cart/load', {
    method: 'POST',
    body: {
      productIdList: cartInfo().getProducts()
    } as ICartDataReq
  }).then(data => {
    data.products?.map(e => {
      e.orderQuantity = 1
      e.selectedOrder = false
      return e
    })
    return data
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

async function toOrder() {
  if (!authData.value || !authData.value?.user) {
    navigateTo('/auth/signIn')
  } else {
    const productsBuy = cartData.value!.products!.filter(e => e.selectedOrder && e.orderQuantity && e.orderQuantity > 0)
    if (isArray(cartData.value?.products) && productsBuy.length > 0) {
      cartInfo().selectedOrderSS().save({
        products: productsBuy,
        totalPrice: useSum(arrayPrice.value)
      })
      await navigateTo('/order')
    } else {
      isErrorMessage.value = true
    }
  }

}

function minusQuantity(product: any, index: number) {
  if (product) {
    if (product.orderQuantity > 0) {
      --product.orderQuantity
      if (!product.orderQuantity && isArray(cartData.value?.products)) {
        cartData.value!.products[index].selectedOrder = false
      }
    }
  }
}

function changeCheckBox(value: number, product: any, index: number) {
  if (value && isArray(cartData.value?.products) && !product?.orderQuantity) {
    cartData.value!.products[index].orderQuantity = 1
  }
}

onBeforeMount(async () => {
  await getProducts()
})

</script>

<template>
  <div class="space-y-5">
    <UAlert v-if="!authData || !authData?.user"
            icon="ic:round-warning"
            :actions="[{ variant: 'solid', color: 'gray', label: 'Đăng nhập ngay', click: () => navigateTo('/auth/signIn')}]"
            title="Bạn cần đăng nhập để thực hiện mua hàng"
    />
    <UAlert v-if="isErrorMessage"
            color="red"
            description="Không có sản phẩm nào được chọn."
            title="Lỗi đặt hàng!"
    />
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
            <div class="flex justify-between items-center rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 md:py-4 py-2 group">
              <label class="flex items-center pl-2 sm:h-32 h-16 w-8">
                <UCheckbox v-model="product.selectedOrder" @change="changeCheckBox($event, product, index)"/>
              </label>
              <div class="flex gap-3 w-full">
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
                  <span class="text-orange-600 font-bold tracking-wider md:text-base text-xs">{{
                      formatNumber(product?.originalPrice)
                    }}</span>
                  <div class="flex justify-between w-full">
                    <div class="flex items-center gap-3">
                      <UButton disabled icon="ic:baseline-minus" size="xs" color="gray"
                               @click="minusQuantity(product, index)"/>
                      <label class="text-gray-600 font-bold">{{ product.orderQuantity }}</label>
                      <UButton disabled icon="ic:outline-plus" size="xs" color="gray"
                               @click="() => ++product.orderQuantity"/>
                    </div>
                    <div class="mr-3">
                      <div v-if="!useDevice().isMobileOrTablet" class="hidden group-hover:block">
                        <UButton icon="heroicons:x-circle" color="red" @click="removeProduct(product.id)"
                                 label="Xóa khỏi giỏ hàng"/>
                      </div>
                      <div v-else>
                        <UButton icon="heroicons:x-circle" variant="ghost" color="red"
                                 @click="removeProduct(product.id)"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <UDivider v-if="index < cartData?.products?.length - 1"/>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between items-center">
          <div class="text-gray-600">
            <span class="text-gray-600 dark:text-white font-semibold">Tổng thanh toán: {{ formatTotalPrice }}</span>
            <span></span>
          </div>
          <UButton icon="heroicons:shopping-cart-16-solid" label="Mua hàng" color="orange" @click="toOrder"/>
        </div>
      </template>
    </UCard>
  </div>
</template>

<style scoped>

</style>