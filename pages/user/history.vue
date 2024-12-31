<script setup lang="ts">
import type {IOrderHistoryReq} from "~/types/TOrder";

const {data} = await useFetch('/api/client/order/history', {
  transform(value) {
    return value as IOrderHistoryReq[]
  }
})
console.log(data.value)
</script>

<template>
  <div>
    <div class="space-y-6">
      <UCard>
        <div class="flex justify-center">
          <span class="font-bold text-2xl">Lịch sử đơn hàng</span>
        </div>
      </UCard>
      <UCard v-for="order in data">
       <template #default>
         <div class="space-y-2">
           <div class="flex justify-between items-center">
             <UBadge v-if="order.payment && order.payment.status === 1" color="primary" variant="solid">Đã thanh toán</UBadge>
             <UBadge color="red" variant="solid">Chưa thanh toán</UBadge>
             <NuxtTime class="font-medium text-gray-400 text-sm" :datetime="order.orderAt" locale="vi-VN" day="numeric" month="numeric" year="numeric"/>
           </div>
           <div class="ml-1 space-y-1">
             <div>
               <div class="flex items-center gap-1">
                 <Icon name="ic:baseline-mail-outline" size="18"/>
                 <span class="font-medium">Địa chỉ nhận: </span>
               </div>
               <span class="ml-6">{{order.shippingAddress}}</span>
             </div>
             <div>
               <div class="flex items-center gap-1">
                 <Icon name="ic:outline-shopping-cart" size="18"/>
                 <span class="font-medium">Sản phẩm mua: </span>
               </div>
               <div v-for="detail in order.details" class="flex justify-between space-x-1 items-center">
                 <span class="hover:underline cursor-pointer ml-6" @click="navigateTo(`/search/prd/${detail.product.alias}`)">{{ detail.product.name }}</span>
                 <span class="text-orange-400">{{detail.price}} x {{detail.quantity}}</span>
               </div>
             </div>
             <div class="flex justify-between">
               <div class="flex items-center gap-1">
                 <Icon name="ic:outline-payments" size="18"/>
                 <span class="font-medium">Tổng thanh toán:</span>
               </div>
               <span class="font-medium text-orange-600">{{order.totalAmount}} {{order.currency}}</span>
             </div>
           </div>
         </div>
       </template>
      </UCard>
    </div>
  </div>
</template>

<style scoped>

</style>