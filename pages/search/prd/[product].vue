<script setup lang="ts">
import type {IProductSearchAndSuggestion} from "~/types/TClient";

const route = useRoute()
const {product} = route.params
const {data} = await useFetch('/api/client/search-with-product', {
  params: {
    product: product
  },
  transform(value: IProductSearchAndSuggestion){
    return value
  }
})

</script>

<template>
  <div class="space-y-7">
    <div>

    </div>
    <GridProducts v-if="data?.suggestion" divider-label="Liên quan" :products="data.suggestion"/>
  </div>
</template>

<style scoped>

</style>