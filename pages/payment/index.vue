<script setup lang="ts">
const {orderId} = useRoute().query


</script>

<template>
  <div>
    <div>
      Order Id: {{ orderId }}
    </div>

  </div>
</template>

<style scoped>

</style>