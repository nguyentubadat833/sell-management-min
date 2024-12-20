<script setup lang="ts">
const {data: authData, signOut} = useAuth()

const isShowUserMenu = ref(false)
// const isShowMainMenu = ref(false)
const userNavItems: {
  label: string,
  icon?: string
  click?: any
  split?: boolean
}[] = [
  {
    label: 'Profile',
    icon: 'mdi:account-circle',
    click: () => {
      navigateTo('/user/profile')
    }
  },
  {
    label: 'Shopping history',
    icon: 'mdi:history',
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
    icon: 'mdi:logout',
    click: () => {
      signOut()
    }
  }
]

const {data: mainMenu} = await queryContent('/menu').findOne()

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

  // document.querySelectorAll('.main-menu-action-item')?.forEach(item => {
  //   item.addEventListener('click', () => {
  //     isShowMainMenu.value = false
  //   });
  // })
  // document.addEventListener('click', (event: any) => {
  //   if (!event?.target?.closest('.main-menu-action-item') && !event?.target?.closest('#main-menu-button')) {
  //     isShowMainMenu.value = false
  //   }
  // });
})

</script>

<template>
  <div class="absolute bg-main bg-repeat dark:bg-none bg-cover bg-center h-auto min-h-screen w-full py-10">
    <header class="fixed w-full space-y-4 z-50">
      <nav
          class="md:w-[23rem] w-[17rem] h-[3rem] p-2 mx-auto flex justify-between transition-all duration-500 ease-in-out
          bg-background/75 backdrop-blur border dark:border-1 rounded-2xl z-50 border-gray-200 dark:border-gray-700">
        <!--      <nav-->
        <!--          class="md:w-[23rem] w-[17rem] hover:md:w-[25rem] hover:w-[20rem] h-[3rem] p-2 mx-auto flex justify-between transition-all duration-500 ease-in-out-->
        <!--          bg-background/75 backdrop-blur border rounded-2xl z-40 border-gray-200 dark:border-gray-800 ">-->
        <UButton icon="heroicons:home-solid" color="gray" variant="ghost" class="rounded-lg" @click="navigateTo('/')"/>
<!--        <UButton id="main-menu-button" icon="heroicons:squares-2x2-16-solid" color="gray" variant="ghost" class="rounded-lg"-->
<!--                 @click="isShowMainMenu = !isShowMainMenu"/>-->
        <UButton icon="heroicons:magnifying-glass-20-solid" color="gray" variant="ghost" class="rounded-lg"/>
        <UButton icon="heroicons:shopping-cart-16-solid" color="gray" variant="ghost" class="rounded-lg"
                 @click="navigateTo('/cart')"/>
        <ChangeColorMode/>
        <UAvatar id="user-button" v-if="authData && authData?.user" size="sm" class="cursor-pointer"
                 :src="authData?.user?.image"
                 alt="A" @click="isShowUserMenu = !isShowUserMenu"/>
        <UButton v-else icon="heroicons:user-16-solid" @click="navigateTo('/auth/signIn')" color="gray" variant="ghost"
                 class="rounded-lg"/>
      </nav>
      <nav>

      </nav>
<!--      <nav v-if="mainMenu" v-show="isShowMainMenu"-->
<!--           class="md:w-[23rem] w-[17rem] p-2 mx-auto transition-all duration-500 ease-in-out backdrop-blur-lg border rounded-md z-50 border-gray-200 dark:border-gray-500 ">-->
<!--        <div class="main-menu-action-item flex gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer" v-for="item in mainMenu">-->
<!--          <span>{{ item?.name }}</span>-->
<!--        </div>-->
<!--      </nav>-->
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
  </div>
</template>


<style scoped>

</style>