<script setup lang="ts">
import type {IOrderReq, IOrderRes} from "~/types/TOrder";
import type {IProductCart} from "~/types/TClient";

const {data: authData} = useAuth()

const isPaymentPaypal = ref(false)
const isPayment = ref(false)
const isLoading = ref(false)
const totalAmount = ref()
const productsCart = ref<IProductCart[]>([])
const orderData = ref<IOrderRes>()
const orderState = reactive<IOrderReq>({
  shippingAddress: authData.value?.user?.email as string,
  shippingMethod: 'Email',
  currency: 'VND',
  details: []
})

onBeforeMount(() => {
  const ssData = cartInfo().selectedOrderSS().get()
  productsCart.value = ssData?.products ?? []
  if (productsCart.value.length > 0 && ssData?.totalPrice) {
    totalAmount.value = formatNumber(ssData.totalPrice)
    orderState.details = productsCart.value.slice(0).map(e => {
      return {
        productId: e.id,
        quantity: e!.orderQuantity as number
      }
    })
  }
  if (orderState.details.length === 0) {
    navigateTo('/order/cart')
  }
})

async function toPayment() {
  isLoading.value = true
  const response = await $fetch('/api/client/order/create', {
    method: 'POST',
    body: orderState
  }).finally(() => {
    isLoading.value = false
  })
  if (response) {
    console.log(response)
    // navigateTo(`/order/payment?orderId=${response.id}`)
    orderData.value = response
    isPayment.value = true
    cartInfo().removeProducts(orderState.details.map(e => e.productId))
  }
}

function paymentPaypal() {
  console.log(orderData.value!.totalAmount.toString())
  isPaymentPaypal.value = true
  if (orderData.value && orderData.value?.id) {
    usePaypalButton({
      style: {
        label: 'paypal',
        color: 'blue'
      },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                // value: orderData.value!.totalAmount.toString(),
                // currency_code: orderData.value?.currency,
                value: '100.00',
                currency_code: 'USD',
              },
              description: orderData.value?.id
            }
          ],
        });
      },
      onApprove: async (data, actions) => {
        try {
          const details = await actions.order?.capture();
          console.log('Payment completed successfully:', details);
        } catch (error) {
          console.error('Error capturing payment:', error);
        }
      },

      onError: (err) => {
        console.error("Error during transaction:", err);
      },
    })
  }
}

</script>

<template>
  <div class="space-y-6">
    <ClientOnly>
      <UCard class="md:w-[50rem] mx-auto">
        <template #header>
          <span class="font-bold text-lg">Thông tin đơn hàng</span>
        </template>
        <template #default>
          <UForm :state="orderState" class="space-y-5">
            <UFormGroup label="Người mua">
              <UInput disabled :model-value="authData?.user?.name"/>
            </UFormGroup>
            <UFormGroup label="Địa chỉ giao hàng">
              <UTextarea v-model="orderState.shippingAddress"/>
            </UFormGroup>
            <UFormGroup label="Đơn vị tiền tệ">
              <UInput disabled v-model="orderState.currency"/>
            </UFormGroup>
            <UFormGroup label="Sản phẩm đặt mua">
              <div v-for="(product, index) in productsCart">
                <div
                    class="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-slate-800 md:py-4 py-2 group">
                  <div class="flex gap-3 w-full">
                    <div
                        class="sm:w-32 w-16 aspect-auto flex-shrink-0 overflow-hidden flex justify-center items-center border dark:border-gray-600">
                      <NuxtImg :src="getProductImageUrl(product.images[0])"
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
                          <label class="text-gray-600 font-bold md:text-base text-xs">Số lượng: {{
                              product.orderQuantity
                            }}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <UDivider v-if="index < productsCart?.length - 1"/>
              </div>
            </UFormGroup>
            <div class="flex justify-between items-center">
              <span class="font-medium">Tổng thanh toán: </span>
              <span class="text-orange-600 font-bold text-lg">{{ totalAmount }}</span>
            </div>
          </UForm>
        </template>
        <template #footer v-if="!isPayment">
          <UButton label="Hoàn tất đơn hàng" block @click="toPayment" :loading="isLoading"/>
        </template>
      </UCard>
      <UCard v-if="isPayment" class="md:w-[50rem] mx-auto">
        <template #header>
          <div class="font-bold text-lg">Thanh toán</div>
          <div class="mt-2 font-medium text-gray-700">
            <span>Mã đơn: </span>
            <span>{{ orderData?.id }}</span>
          </div>
        </template>
        <template #default>
          <div class="flex justify-center">
            <div class="payment-group flex items-center gap-5">
              <div class="payment-group-wrapper-img" @click="paymentPaypal">
                <NuxtImg src="/images/icon/paypal.svg" class="payment-group-img"/>
              </div>
              <div class="payment-group-wrapper-img">
                <NuxtImg src="/images/icon/vnpay.svg" class="payment-group-img"/>
              </div>
            </div>
          </div>
          <div v-show="isPaymentPaypal" class="p-3 mt-3 bg-white">
            <div id="paypal-checkout">
            </div>
          </div>
        </template>
      </UCard>
    </ClientOnly>
  </div>
</template>

<style scoped>
.payment-group {
  .payment-group-wrapper-img {
    @apply rounded-lg border-2 h-24 flex items-center p-5 dark:border-gray-700 cursor-pointer;

    .payment-group-img {
      @apply w-32
    }
  }
}
</style>