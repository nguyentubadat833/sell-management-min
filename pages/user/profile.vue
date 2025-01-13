<script setup lang="ts">
import type {IProfileRes, IProfileSaveReq} from "~/types/TProfile";

const {data: getProfile, refresh} = await useFetch('/api/client/profile/get', {
  transform(value) {
    return value as IProfileRes
  }
})

console.log(getProfile.value)
const toast = useToast()
const profileState = reactive<IProfileSaveReq>({
  name: '',
  shippingAddress: ''
})

onBeforeMount(() => {
  if (getProfile.value) {
    profileState.name = getProfile.value?.profile.name
    profileState.shippingAddress = getProfile.value?.profile.shippingAddress
  }
})

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

</script>

<template>
  <div>
    <UCard v-if="getProfile">
      <template #header>
        <div class="flex items-center gap-2">
          <UAvatar :src="getProfile.profile?.avatar" alt="A" size="md"/>
          <span class="text-xl font-bold">{{ profileState.name }}</span>
        </div>
      </template>
      <template #default>
        <div class="min-h-[50vh]">
          <UForm class="md:w-96 mx-auto space-y-7" @submit="save">
            <UFormGroup label="Name">
              <UInput v-model="profileState.name"/>
            </UFormGroup>
            <UFormGroup label="Email" v-if="getProfile.email">
              <UInput disabled v-model="getProfile.email"/>
            </UFormGroup>
            <UFormGroup label="Shipping address">
              <UTextarea v-model="profileState.shippingAddress"/>
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