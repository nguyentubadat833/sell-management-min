<script setup lang="ts">
import type {IOrderHistoryReq} from "~/types/TOrder";

const toast = useToast()
const {data, refresh} = await useFetch('/api/client/order/history', {
  transform(value) {
    return value as IOrderHistoryReq[]
  }
})
console.log(data.value)
const formatDate = (datetime: string) => datetime.split("T")[0];
const groupedOrders = computed(() => {
  const groups = {} as any;
  data.value?.forEach((order) => {
    const date = formatDate(order.orderAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(order);
  });
  return groups;
});

function deleteOrder(id: string) {
  console.log(id)
  toast.add({
    title: 'Xóa đơn hàng',
    description: `${id}`,
    color: 'yellow',
    actions: [
      {
        label: 'Tiếp tục xóa',
        click: async () => {
          const result = await $fetch('/api/client/order/delete', {
            method: 'PUT',
            params: {
              id: id
            }
          })
          if (result) {
            toast.add({title: 'Đã xóa đơn hàng', timeout: 2000})
            await refresh()
          } else {
            toast.add({title: 'Không thể xóa', timeout: 2000, color: "red"})
          }
        }
      }
    ]
  })
}

function toPayment(id: string) {
  if (isString(id)) {
    navigateTo(`/order/payment?orderId=${id}`)
  }
}

</script>

<template>
  <div>
    <UCard>
      <div class="flex justify-center">
        <span class="font-bold text-2xl">Lịch sử đơn hàng</span>
      </div>
    </UCard>
    <div v-for="(group, date) in groupedOrders" :key="date">
      <UDivider class="my-5">
        <template #default>
          <NuxtTime class="font-medium text-gray-400 text-sm" :datetime="date" locale="vi-VN" day="numeric"
                    month="numeric" year="numeric"/>
        </template>
      </UDivider>
      <div class="space-y-6">
        <div v-for="(order) in group" class="group">
          <UCard>
            <template #default>
              <div class="space-y-1">
                <div class="flex md:justify-end items-center">
                  <span class="font-medium text-gray-400 text-sm">Mã đơn: {{ order?.id }}</span>
                </div>
                <div class="ml-1 space-y-1">
                  <div>
                    <div class="flex items-center gap-1">
                      <Icon name="ic:baseline-mail-outline" size="18"/>
                      <span class="font-medium">Địa chỉ nhận: </span>
                    </div>
                    <span class="ml-6">{{ order.shippingAddress }}</span>
                  </div>
                  <div>
                    <div class="flex items-center gap-1">
                      <Icon name="ic:outline-shopping-cart" size="18"/>
                      <span class="font-medium">Sản phẩm mua: </span>
                    </div>
                    <div v-for="detail in order.details" class="flex justify-between space-x-1 items-center">
                  <span class="hover:underline cursor-pointer ml-6"
                        @click="navigateTo(`/search/prd/${detail.product.alias}`)">{{ detail.product.name }}</span>
                      <span class="text-gray-400">{{ detail.price }} x {{ detail.quantity }}</span>
                    </div>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <Icon name="ic:outline-payments" size="18"/>
                      <span class="font-medium">Tổng thanh toán:</span>
                    </div>
                    <span class="font-medium text-orange-600">{{ order.totalAmount }} {{ order.currency }}</span>
                  </div>
                </div>

              </div>
            </template>
          </UCard>
          <div v-if="!order.payment || !order.payment.status"
               class="overflow-hidden transition-[max-height] ease-in-out group-active:duration-700 group-hover:duration-700 group-hover:max-h-96 group-active:max-h-96 duration-300 max-h-0"
          >
            <div class="flex justify-between items-center py-6">
              <div @click="deleteOrder(order?.id)"
                   class="text-gray-500 text-sm font-medium cursor-pointer flex items-center gap-1">
                <Icon name="ic:round-delete"/>
                <span>Xóa đơn hàng</span>
              </div>
              <UBadge color="red" variant="solid" class="cursor-pointer" @click="toPayment(order?.id)">Tiến hành thanh
                toán
              </UBadge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>