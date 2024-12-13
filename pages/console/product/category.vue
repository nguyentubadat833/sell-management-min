<script setup lang="ts">

const columns = [
  {key: 'name', label: 'Name'},
  {key: 'createdAt', label: 'Created At'}
]

const categoryState = reactive({
  name: '',
  createdAt: undefined
})

</script>

<template>
  <div>
<!--    <UTable nuxt-client :columns="columns" :rows="data"/>-->
<!--    <UButton nuxt-client label="Add" @click="addCategory"/>-->
  </div>
</template>

<style scoped>

</style>