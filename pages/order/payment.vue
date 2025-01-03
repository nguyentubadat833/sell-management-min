<script setup lang="ts">

import type {IOrderRes} from "~/types/TClient";
import type {TOrderExchangeRate} from "~/types/TOrder";

const orderIdReq = computed(() => useRoute().query?.orderId)
const isPaymentPaypal = ref(false)
const isPaypalInitialized = ref(false)
const isPayment = ref(false)
const isNotFound = ref(false)
const orderData = ref<IOrderRes>()

async function getOrderData() {
  orderData.value = await $fetch(`/api/client/order/get`, {
    params: {
      id: orderIdReq.value
    }
  })
}

onBeforeMount(async () => {
  const isPaid = await $fetch('/api/client/order/isPaid', {
    params: {
      orderId: orderIdReq.value
    }
  }).catch(err => {
    if (err?.status === 404) {
      isNotFound.value = true
    }
  })
  if (isPaid === false) {
    isPayment.value = true
  }
})

async function paymentPaypal() {
  if (isPaypalInitialized.value) {
    return
  }
  await getOrderData()
  if (orderData.value) {
    isPaymentPaypal.value = true
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
            await $fetch('/api/client/payment/paypal', {
              method: 'POST',
              body: paypalRes
            })
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

</script>

<template>
  <div class="space-y-6">
    <ClientOnly>
      <div v-if="isNotFound" class="flex items-center gap-2">
        <Icon name="heroicons:exclamation-triangle-16-solid" size="30" class="text-gray-600"/>
        <span class="text-lg">Đơn hàng không tồn tại</span>
      </div>
      <div v-else>
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
            <div v-if="isPayment">
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
            </div>
            <div v-else class="flex items-center gap-2">
              <Icon name="mdi:checkbox-marked-circle-outline" size="50" class="text-green-600"/>
              <span class="text-lg">Đơn hàng đã thanh toán</span>
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