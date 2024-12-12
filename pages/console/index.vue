<script setup lang="ts">
definePageMeta({
  layout: 'console'
})
// const data = await usePrismaClient().user.findMany()
function add() {
  console.log('test')
}
</script>

<template>
  <div>
    <UButton label="test" @click="add"/>
    console index
  </div>
</template>

<style scoped>

</style>