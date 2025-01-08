<script setup lang="ts">
definePageMeta({
  name: 'Order Management'
})
const {data} = await useFetch('/api/control/sell/order/findMany')
const columns = [
  {label: 'ID', key: 'id'},
  {label: 'Order at', key: 'orderAt'},
  {label: 'Amount', key: 'totalAmount'},
  {label: 'Payment status', key: 'payment.status'},
  {label: 'Payment method', key: 'payment.paymentMethod'},
  {label: 'Payment completed at', key: 'payment.paymentCompleteAt'}
]

const q = ref('')

const filteredRows = computed(() => {
  if (!q.value) {
    return data.value
  }

  return data.value?.filter((data) => {
    return Object.values(data).some((data) => {
      return String(data).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})

</script>

<template>
  <div>
    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <UInput v-model="q" placeholder="Filter..."/>
    </div>
    <UTable :columns="columns" :rows="filteredRows">
      <template #totalAmount-data="{row}">
        {{ row.totalAmount }} {{ row.currency }}
      </template>
      <template #orderAt-data="{row}">
        <NuxtTime :datetime="row.orderAt" locale="vi-VN" day="numeric" month="numeric" year="numeric"/>
      </template>
      <template #payment.paymentCompleteAt-data="{row}">
        <NuxtTime v-if="row?.payment?.paymentCompleteAt" :datetime="row.payment.paymentCompleteAt" locale="vi-VN"
                  day="numeric" month="numeric"
                  year="numeric"/>
      </template>
      <template #payment.status-data="{row}">
        <div>
          <span v-if="row?.payment?.status === 1" class="bg-green-300 p-1">Đã thanh toán</span>
          <span v-else-if="!row?.payment || !row?.payment?.status" class="p-1">Chưa thanh toán</span>
          <span v-else-if="row?.payment?.status === 2" class="bg-yellow-200 p-1">Thanh toán chưa đủ</span>
        </div>
      </template>
    </UTable>
  </div>
</template>

<style scoped>

</style>