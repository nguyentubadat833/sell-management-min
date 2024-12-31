<script setup lang="ts">

import Developer from "~/components/Developer.vue";

const {data: authData, signOut} = useAuth()

const isOpenDevModal = ref(false)
const isShowUserMenu = ref(false)
const isOpenSearch = ref(false)
const userNavItems: {
  label: string,
  icon?: string
  click?: any
  split?: boolean
}[] = [
  {
    label: 'Profile',
    // icon: 'mdi:account-circle',
    click: () => {
      navigateTo('/user/profile')
    }
  },
  {
    label: 'Shopping history',
    // icon: 'mdi:history',
    click: () => {
      navigateTo('/user/history')
    }
  },
  {
    label: '',
    split: true
  },
  {
    label: 'Sign Out',
    // icon: 'mdi:logout',
    click: () => {
      signOut()
    }
  }
]

function searchComplete() {
  isOpenSearch.value = false
}

onMounted(() => {
  document.querySelectorAll('.user-menu-action-item')?.forEach(item => {
    item.addEventListener('click', () => {
      isShowUserMenu.value = false
    });
  })
  document.addEventListener('click', (event: any) => {
    if (!event?.target?.closest('.user-menu-action-item') && !event?.target?.closest('#user-button')) {
      isShowUserMenu.value = false
    }
  });
})
onBeforeMount(() => {
  countCartProducts.value = cartInfo().countProducts()
})

</script>

<template>
  <!--  <div class="bg-main bg-repeat dark:bg-none bg-cover bg-center h-auto min-h-screen py-10 tracking-wider">-->
  <div class="dark:bg-none bg-cover bg-center h-auto min-h-screen py-10">
    <header class="fixed w-full space-y-4 z-50">
      <nav
          class="md:w-[23rem] w-[17rem] h-[3rem] p-2 mx-auto flex justify-between transition-all duration-500 ease-in-out
          bg-background/75 backdrop-blur border dark:border-1 rounded-2xl z-50 border-gray-200 dark:border-gray-700">
        <!--      <nav-->
        <!--          class="md:w-[23rem] w-[17rem] hover:md:w-[25rem] hover:w-[20rem] h-[3rem] p-2 mx-auto flex justify-between transition-all duration-500 ease-in-out-->
        <!--          bg-background/75 backdrop-blur border rounded-2xl z-40 border-gray-200 dark:border-gray-800 ">-->
        <UButton icon="heroicons:home-solid" color="gray" variant="ghost" class="rounded-lg" @click="navigateTo('/')"/>
        <UButton icon="heroicons:magnifying-glass-20-solid" color="gray" variant="ghost" class="rounded-lg"
                 @click="isOpenSearch = !isOpenSearch"/>
        <UButton icon="heroicons:shopping-cart-16-solid" color="gray" variant="ghost" class="relative rounded-lg"
                 @click="navigateTo('/order/cart')">
          <ClientOnly>
                      <span
                          class="right-0 top-0 absolute px-1 border-white rounded-full bg-red-500 opacity-90 text-white text-xs">{{
                          countCartProducts
                        }}</span>
          </ClientOnly>
        </UButton>
        <ChangeColorMode/>
        <UAvatar id="user-button" v-if="authData && authData?.user" size="sm" class="cursor-pointer"
                 :src="authData?.user?.image"
                 alt="A" @click="isShowUserMenu = !isShowUserMenu"/>
        <UButton v-else icon="heroicons:user-16-solid" @click="navigateTo('/auth/signIn')" color="gray" variant="ghost"
                 class="rounded-lg"/>
      </nav>
      <nav>

      </nav>
      <nav v-if="authData && authData?.user" v-show="isShowUserMenu"
           class="md:w-[23rem] w-[17rem] p-2 mx-auto transition-all duration-500 ease-in-out backdrop-blur-lg border rounded-md z-50 border-gray-200 dark:border-gray-500 ">
        <div>
          <div class="user-menu-action-item" v-for="item in userNavItems"
               @click="!item.split  && typeof item.click === 'function' ? item.click() : null">
            <UDivider v-if="item?.split" :label="item.label" class="p-2"/>
            <div v-else
                 class="flex gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
              <Icon v-if="item?.icon" :name="item.icon" size="22"/>
              <div>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
    <main class="px-3 mt-24">
      <div class="w-full xl:w-[70vw] mx-auto">
        <NuxtPage/>
      </div>
    </main>
    <footer>
    </footer>
    <ClientOnly>
      <UModal v-model="isOpenSearch">
        <ClientSearch @searchComplete="searchComplete"/>
      </UModal>
    </ClientOnly>
    <DevOnly>
      <div class="absolute top-1 right-1">
        <UButton label="Developer" @click="isOpenDevModal = true"/>
        <ClientOnly>
          <UModal v-model="isOpenDevModal">
            <UCard>
              <Developer/>
            </UCard>
          </UModal>
        </ClientOnly>
      </div>
    </DevOnly>
  </div>
</template>


<style scoped>

</style>