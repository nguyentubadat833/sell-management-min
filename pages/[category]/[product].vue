<script setup lang="ts">
const route = useRoute()
const {product} = route.params
const {data} = await useFetch('/api/client/search-with-product', {
  params: {
    product: product
  }
})
console.log(data.value)
</script>

<template>
  <div>

  </div>
</template>

<style scoped>

</style>