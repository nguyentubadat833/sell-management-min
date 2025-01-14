<script setup lang="ts">

import type {TOrderExchangeRate} from "~/types/TOrder";
import type {IVnPayCreateUrlReq, paymentMethod} from "~/types/TPayment";

const orderIdReq = useState(useId(), () => useRoute().query?.orderId)
const isPaid = ref<boolean | null>(null)
const isPaypalInitialized = ref(false)
const vietQRURL = ref<string | null>(null)
const dividerLabel = ref<string>()
const isLoadPaymentMethod = ref(false)
const paymentMethod = ref<paymentMethod>()

onMounted(async () => {
  await $fetch('/api/client/order/isPaid', {
    params: {
      orderId: orderIdReq.value
    }
  }).then(result => {
    isPaid.value = result ?? null
  })
})

async function paymentPaypal() {
  async function action() {
    if (paymentMethod.value === 'paypal') {
      return
    }
    paymentMethod.value = 'paypal'
    dividerLabel.value = 'Thanh toán paypal'
    if (isPaid.value !== null) {
      const orderExChange = await $fetch('/api/client/order/exchange/vnd-to-usd', {
        params: {
          orderId: orderIdReq.value
        }
      })
      if (orderExChange) {
        isPaypalInitialized.value = true
        const exchangeRate = orderExChange.exchangeRate as TOrderExchangeRate
        await usePaypalButton({
          style: {
            label: 'paypal',
            color: 'blue'
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: `${exchangeRate.USD}`,
                    currency_code: `USD`,
                  },
                  description: JSON.stringify({orderId: orderIdReq.value})
                }
              ],
            });
          },
          onApprove: async (data, actions) => {
            try {
              const paypalRes = await actions.order?.capture();
              const paymentRes = await $fetch('/api/client/payment/paypal', {
                method: 'POST',
                body: paypalRes
              })
              if (paymentRes) {
                reloadNuxtApp()
              }
            } catch (error) {
              console.error('Error capturing payment:', error);
            }
          },
          onError: (err) => {
            console.error("Error during transaction:", err);
          },
        })
      } else {
        useToast().add({
          title: 'Không thể thanh toán',
          color: "red",
          description: 'Đơn hàng này không tồn tại',
          actions: [
            {
              label: 'Về giỏ hàng',
              click: () => navigateTo('/cart')
            }, {
              label: 'Xem các đơn hàng',
              click: () => navigateTo('/order/history')
            }
          ]
        })
      }
    }
  }

  isLoadPaymentMethod.value = true
  await action().finally(() => {
    isLoadPaymentMethod.value = false
  })
}

async function paymentVNPAY() {
  const createUrl = await $fetch('/api/client/payment/vnpay/create-url', {
    method: 'POST',
    body: {
      orderId: orderIdReq.value
    } as IVnPayCreateUrlReq
  })
  navigateTo(createUrl, {
    external: true
  })
}

async function paymentVietQR() {
  // isLoadPaymentMethod.value = true
  // await $fetch('/api/client/payment/vietqr/create-qr', {
  //   params: {
  //     orderId: orderIdReq.value
  //   }
  // }).then(data => {
  //   if (data) {
  //     vietQRURL.value = data as string
  //     paymentMethod.value = 'vietqr'
  //     dividerLabel.value = 'Thanh toán QR'
  //   }
  // }).finally(() => {
  //   isLoadPaymentMethod.value = false
  // })

  await $fetch('/api/client/payment/payos/create-payment-link', {
    params: {
      orderId: orderIdReq.value
    }
  })
      .then(res => {
        console.log(res)
      })
}
</script>

<template>
  <div class="space-y-6">
    <ClientOnly>
      <div>
        <UCard class="md:w-[50rem] mx-auto">
          <template #header>
            <div class="flex items-center gap-2">
              <Icon name="ic:outline-payments" size="25"/>
              <div class="font-bold text-lg">Thanh toán</div>
            </div>
          </template>
          <template #footer>
            <div class="mt-2 font-medium text-sm italic text-gray-500">
              <span>Đơn hàng: </span>
              <span>{{ orderIdReq }}</span>
            </div>
          </template>
          <template #default>
            <div v-if="!isPaid">
              <div class="flex justify-center mt-2">
                <div class="payment-group flex items-center gap-5">
                  <div class="payment-group-wrapper-img" @click="paymentPaypal">
                    <NuxtImg src="/images/icon/paypal.svg" class="payment-group-img"/>
                  </div>
                  <div class="payment-group-wrapper-img" @click="paymentVNPAY">
                    <NuxtImg src="/images/icon/vnpay.svg" class="payment-group-img"/>
                  </div>
                  <div class="payment-group-wrapper-img" @click="paymentVietQR">
                    <NuxtImg src="/images/icon/vietqr.png" class="payment-group-img"/>
                  </div>
                  <div class="payment-group-wrapper-img">
                    <NuxtImg src="/images/icon/cod.png" class="payment-group-img"/>
                  </div>
                </div>
              </div>
              <div v-show="!isLoadPaymentMethod && paymentMethod">
                <UDivider :label="dividerLabel" class="py-5"/>
                <div :class="{'bg-white rounded-md p-4': paymentMethod}">
                  <div v-if="paymentMethod === 'paypal'" id="paypal-checkout">
                  </div>
                  <NuxtImg v-else-if="paymentMethod === 'vietqr' && vietQRURL" :src="vietQRURL" class="mx-auto"/>
                </div>
              </div>
              <USkeleton v-show="isLoadPaymentMethod" class="h-72 w-full mt-5"/>
            </div>
            <div v-else class="flex items-center gap-2">
              <Icon name="mdi:checkbox-marked-circle-outline" size="40" class="text-green-600"/>
              <span>Đã thanh toán</span>
            </div>
          </template>
        </UCard>
      </div>
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