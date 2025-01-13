<script setup lang="ts">

import type {IProfileRes, IUserDeliveryInfo} from "~/types/TUser";

const {data: userProfile, refresh} = await useFetch('/api/client/profile', {
  transform(value) {
    return value as IProfileRes
  }
})

const toast = useToast()

const profileState = reactive<{
  name: string,
  avatar?: string
  email?: string,
  deliveryInfo?: IUserDeliveryInfo[]
}>({
  avatar: '',
  name: '',
  email: '',
  deliveryInfo: [],
})

if (userProfile.value) {
  profileState.avatar = userProfile.value?.profile.avatar
  profileState.name = userProfile.value?.profile.name
  profileState.email = userProfile.value?.email ?? ''
  profileState.deliveryInfo = userProfile.value?.deliveryInfo ?? []
}

async function save() {
  const data = await $fetch('/api/client/profile/save', {
    method: 'PUT',
    body: profileState
  })
  if (data) {
    toast.add({
      color: 'green',
      title: 'Cập nhật thành công'
    })
    await refresh()
  } else {
    toast.add({
      color: 'red',
      title: 'Lỗi cập nhật'
    })
  }
}

function addDelivery() {
  profileState.deliveryInfo!.push({
    phone: '',
    address: ''
  })
}
</script>

<template>
  <div>
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UAvatar :src="profileState.avatar" alt="A" size="md"/>
          <span class="text-xl font-bold">{{ profileState.name }}</span>
        </div>
      </template>
      <template #default>
        <div class="min-h-[50vh]">
          <UForm class="md:w-96 mx-auto space-y-7" @submit="save" :state="profileState">
            <UFormGroup label="Name">
              <UInput :model-value="profileState.name"/>
            </UFormGroup>
            <UFormGroup label="Email" v-if="profileState.email">
              <UInput disabled :model-value="profileState.email"/>
            </UFormGroup>
            <UFormGroup label="Delivery Info">
              <UCard v-for="info in profileState.deliveryInfo">
                <!--                <UFormGroup label="Address">-->
                <!--                  <UTextarea v-model="info.address"/>-->
                <!--                </UFormGroup>-->
                <!--                <UFormGroup label="Phone">-->
                <!--                  <UTextarea v-model="info.phone"/>-->
                <!--                </UFormGroup>-->
              </UCard>
              <UButton icon="heroicons:plus-20-solid" color="gray" @click="addDelivery"/>
            </UFormGroup>

            <UButton type="submit" label="Submit" block/>
          </UForm>
        </div>
      </template>
    </UCard>
  </div>
</template>

<style scoped>

</style>