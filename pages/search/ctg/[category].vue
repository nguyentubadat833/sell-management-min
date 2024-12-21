<script setup lang="ts">
const route = useRoute()
const {category: categoryAlias} = route.params
const {data} = await useFetch(`/api/client/search-with-category`, {
  params: {
    alias: categoryAlias
  }
})
</script>

<template>
  <div>
    <GridProducts v-if="data" :divider-label="data.categoryName" :products="data.products"/>
  </div>
</template>

<style scoped>

</style>