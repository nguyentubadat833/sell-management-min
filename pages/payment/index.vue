<script setup lang="ts">

import QrcodeVue from 'qrcode.vue'
import type {TOrderExchangeRate} from "~/types/TOrder";
import type {IVnPayCreateUrlReq, TPaymentMethod} from "~/types/TPayment";
import type {CheckoutResponseDataType} from "@payos/node/lib/type";

const runtimeConfig = useRuntimeConfig()
const orderIdReq = useState(useId(), () => useRoute().query?.orderId)
const isPaid = ref<boolean | null>(null)
const isPaypalInitialized = ref(false)
const vietQRURL = ref<string | null>(null)
const dividerLabel = ref<string>()
const isLoadPaymentMethod = ref(false)
const paymentMethod = ref<TPaymentMethod>()
const payOSData = ref<CheckoutResponseDataType>()
const methods = runtimeConfig?.public?.acceptPaymentMethods as TPaymentMethod[]

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
            color: 'blue',
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
              const paymentRes = await $fetch('/api/client/payment/paypal/approve', {
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

async function paymentPayOS() {
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

  isLoadPaymentMethod.value = true
  await $fetch('/api/client/payment/payos/create-payment-link', {
    params: {
      orderId: orderIdReq.value
    }
  }).then(data => {
    if (data) {
      payOSData.value = data
      paymentMethod.value = 'payos'
      dividerLabel.value = 'Thanh toán QR'
    }
  }).finally(() => {
    isLoadPaymentMethod.value = false
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
                <!--                <div class="payment-group flex items-center gap-5">-->
                <div class="payment-group grid md:grid-cols-4 grid-cols-2 md:gap-5 gap-2">
                  <div class="payment-group-wrapper-img" @click="paymentPayOS" v-if="methods.includes('payos')">
                    <NuxtImg src="/images/icon/qrcode.svg" class="payment-group-img p-4"/>
                  </div>
                  <div class="payment-group-wrapper-img" v-if="methods.includes('cod')">
                    <NuxtImg src="/images/icon/cod.png" class="payment-group-img p-1 pt-4"/>
                  </div>
                  <div class="payment-group-wrapper-img" @click="paymentVNPAY" v-if="methods.includes('vnpay')">
                    <NuxtImg src="/images/icon/vnpay.svg" class="payment-group-img"/>
                  </div>
                  <div class="payment-group-wrapper-img" @click="paymentPaypal" v-if="methods.includes('paypal')">
                    <NuxtImg src="/images/icon/paypal.svg" class="payment-group-img"/>
                  </div>
                </div>
              </div>
              <div v-show="!isLoadPaymentMethod && paymentMethod">
                <UDivider :label="dividerLabel" class="py-5"/>
                <div :class="{'bg-white rounded-md p-4': paymentMethod}">
                  <div v-if="paymentMethod === 'paypal'" id="paypal-checkout">
                  </div>
                  <!--                  <NuxtImg v-else-if="paymentMethod === 'vietqr' && vietQRURL" :src="vietQRURL" class="mx-auto"/>-->
                  <div v-else-if="paymentMethod === 'payos' && payOSData" class="grid grid-cols-2 gap-4">
                    <div class="flex justify-end">
                      <div class="border p-3">
                        <QrcodeVue :size="useDevice().isMobile ? 150 : 260" :value="payOSData?.qrCode"/>
                      </div>
                    </div>
                    <div class="qrcode-info">
                      <div>
                        <Icon name="material-symbols-light:account-box-sharp" size="30"/>
                        <span>{{ payOSData?.accountName }}</span>
                      </div>
                      <div>
                        <Icon name="material-symbols-light:payments-outline-sharp" size="30"/>
                        <span>{{ formatNumber(payOSData?.amount) }}</span>
                      </div>
                    </div>
                  </div>
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
.qrcode-info {
  @apply flex flex-col justify-center space-y-1;

  div {
    @apply flex items-center gap-2;

    span {
      @apply font-bold
    }
  }
}

.payment-group {
  .payment-group-wrapper-img {
    @apply shadow rounded-lg aspect-[6/4] flex items-center justify-center py-2 px-4 overflow-hidden border dark:border-gray-700 cursor-pointer;

    .payment-group-img {
      @apply w-full;
    }
  }
}
</style>

<!--.payment-group {-->
<!--.payment-group-wrapper-img {-->
<!--@apply rounded-lg border-2 h-24 flex items-center p-5 dark:border-gray-700 cursor-pointer overflow-hidden;-->

<!--.payment-group-img {-->
<!--@apply w-32-->
<!--}-->
<!--}-->
<!--}-->