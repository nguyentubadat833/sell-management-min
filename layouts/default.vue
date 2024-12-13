<script setup lang="ts">

</script>

<template>
  <div class="bg-main dark:bg-none bg-cover bg-center h-screen py-3">
    <header>
      <nav
          class="md:w-[23rem] w-[17rem] hover:md:w-[25rem] hover:w-[20rem] h-[3rem] p-2 mx-auto flex justify-between transition-all duration-300 ease-in-out
          bg-background/75 backdrop-blur border rounded-2xl -mb-px sticky top-0 z-50 border-gray-200 dark:border-gray-800 ">
        <UButton icon="heroicons:home-solid" color="gray" variant="ghost" class="rounded-lg" @click="navigateTo('/')"/>
        <UButton icon="heroicons:squares-2x2-16-solid" color="gray" variant="ghost" class="rounded-lg"/>
        <UButton icon="heroicons:magnifying-glass-20-solid" color="gray" variant="ghost" class="rounded-lg"/>
        <UButton icon="heroicons:shopping-cart-16-solid" color="gray" variant="ghost" class="rounded-lg" @click="navigateTo('/cart')"/>
        <UButton icon="heroicons:user-16-solid" @click="navigateTo('/auth/signIn')" color="gray" variant="ghost"
                 class="rounded-lg"/>
      </nav>
    </header>
    <main class="px-3">
      <NuxtPage/>
    </main>
    <footer>

    </footer>
  </div>
</template>

<style scoped>

</style>