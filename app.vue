<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
  <UNotifications />
</template>
<script setup lang="ts">
</script>
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.6s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.layout-enter-active,
.page-leave-active {
  transition: all 0.6s;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>