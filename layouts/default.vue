<script setup lang="ts">
import Dropdown from "~/components/Dropdown.vue";

const {data: authData} = useAuth()

const userDropdownItems: {
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
    label: "",
    split: true
  },
  {
    label: 'Sign Out',
    icon: 'mdi:logout',
    click: () => {

    }
  }
]
</script>

<template>
  <div class="absolute bg-main dark:bg-none bg-cover bg-center h-screen w-full py-5">
    <header class="fixed w-full">
      <nav
          class="md:w-[23rem] w-[17rem] h-[3rem] p-2 mx-auto flex justify-between transition-all duration-500 ease-in-out
          bg-background/75 backdrop-blur border rounded-2xl z-40 border-gray-200 dark:border-gray-800 ">
<!--      <nav-->
<!--          class="md:w-[23rem] w-[17rem] hover:md:w-[25rem] hover:w-[20rem] h-[3rem] p-2 mx-auto flex justify-between transition-all duration-500 ease-in-out-->
<!--          bg-background/75 backdrop-blur border rounded-2xl z-40 border-gray-200 dark:border-gray-800 ">-->
        <UButton icon="heroicons:home-solid" color="gray" variant="ghost" class="rounded-lg" @click="navigateTo('/')"/>
        <MegaDropdown :dropdown-id="useId()" :items="[]">
          <UButton icon="heroicons:squares-2x2-16-solid" color="gray" variant="ghost" class="rounded-lg"/>
        </MegaDropdown>
        <UButton icon="heroicons:magnifying-glass-20-solid" color="gray" variant="ghost" class="rounded-lg"/>
        <UButton icon="heroicons:shopping-cart-16-solid" color="gray" variant="ghost" class="rounded-lg"
                 @click="navigateTo('/cart')"/>
        <!--        <UAvatar id="dropdownDefaultButton" data-dropdown-toggle="dropdown"-->
        <!--                 v-if="authData && authData?.user"-->
        <!--                 size="sm"-->
        <!--                 class="cursor-pointer"-->
        <!--                 :src="authData?.user?.image"-->
        <!--                 alt="A"-->
        <!--        />-->
        <Dropdown :dropdownId="useId()" :items="userDropdownItems" v-if="authData && authData?.user">
          <UAvatar size="sm" class="cursor-pointer" :src="authData?.user?.image" alt="A"/>
        </Dropdown>
        <UButton v-else icon="heroicons:user-16-solid" @click="navigateTo('/auth/signIn')" color="gray" variant="ghost"
                 class="rounded-lg"/>

        <!-- Dropdown user menu -->
        <!--        <div id="dropdown"-->
        <!--             class="z-10 px-1 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-52 dark:bg-gray-700">-->
        <!--          <div class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">-->
        <!--            <div v-for="item in userDropdownItems"-->
        <!--                 @click="!item.split  && typeof item.click === 'function' ? item.click() : null">-->
        <!--              <UDivider v-if="item?.split" :label="item.label" class="p-2"/>-->
        <!--              <div v-else-->
        <!--                   class="flex gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">-->
        <!--                <Icon v-if="item?.icon" :name="item.icon" size="22"/>-->
        <!--                <div>-->
        <!--                  <span>{{ item.label }}</span>-->
        <!--                </div>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->

      </nav>
    </header>
    <main class="px-3 pt-[5rem]">
      <NuxtPage/>
    </main>
    <footer>
    </footer>
  </div>
</template>


<style scoped>

</style>