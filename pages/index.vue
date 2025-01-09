<script setup lang="ts">
import GridProducts from "~/components/GridProducts.vue";

const {data: indexData} = await useFetch('/api/client/index-data')
const carouselRef = ref()
onMounted(() => {
  setInterval(() => {
    if (!carouselRef.value) return

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0)
    }
    carouselRef.value.next()
  }, 3000)
})
</script>

<template>
  <div class="space-y-7">
    <UCarousel v-if="indexData?.banner"
               ref="carouselRef"
               v-slot="{ item }"
               :items="indexData?.banner"
               :ui="{ item: 'basis-full' }"
               class="rounded-lg overflow-hidden !z-30"
               indicators
    >
      <img :src="joinPath('/images', item?.location, item?.name)" class="w-full" draggable="false" alt="Image">
    </UCarousel>
    <GridProducts :products="indexData?.products" divider-label="Mới nhất"/>
  </div>
</template>

<style scoped>

</style>