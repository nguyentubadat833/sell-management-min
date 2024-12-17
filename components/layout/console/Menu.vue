<script setup lang="ts">
type item = {
  label: string
  to: string
  icon?: string
}
const items = [
  [{
    label: 'Users',
    icon: 'heroicons:user-group-16-solid',
    click: () => {
      navigateTo('/console/users')
    }
  }], [{
    label: 'Category',
    icon: 'heroicons:squares-plus',
    click: () => {
      navigateTo('/console/product/category')
    }
  }, {
    label: 'Product',
    icon: 'heroicons:swatch-20-solid',
    click: () => {
      navigateTo('/console/product')
    }
  }], [{
    label: 'Orders',
    icon: 'heroicons:document-text',
    click: () => {
      navigateTo('/console/sell/order')
    }
  }, {
    label: 'Payment',
    icon: 'heroicons:credit-card-solid'
  }], [{
    label: 'Inventory',
    icon: 'heroicons:square-3-stack-3d-solid',
    click: () => {
      navigateTo('/console/inventory')
    }
  }]
]
</script>

<template>
  <div class="flex justify-between">
    <div class="flex items-center">
      <span class="font-bold text-2xl">Sell Management</span>
    </div>
    <div class="flex items-center justify-end gap-5">
      <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
        <UButton color="white" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid"/>
      </UDropdown>
      <ChangeColorMode/>
    </div>
  </div>
</template>

<style scoped>

</style>