<script setup lang="ts">
onMounted(() => {
  document.getElementById('test')?.addEventListener('click', () => {
    console.log('test')
  })
})
console.log('test')
</script>

<template>
<div>
  <UButton nuxt-client id="test" label="test"/>
</div>
</template>

<style scoped>

</style>