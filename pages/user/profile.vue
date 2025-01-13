<script setup lang="ts">

import type {IProfileRes, IProfileSaveReq, IUserDeliveryInfo} from "~/types/TUser";

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

function initState() {
  if (userProfile.value) {
    profileState.avatar = userProfile.value?.profile.avatar
    profileState.name = userProfile.value?.profile.name
    profileState.email = userProfile.value?.email ?? ''
    profileState.deliveryInfo = userProfile.value?.deliveryInfo ?? []
  }
}

onMounted(() => {
  initState()
})

async function save() {
  const data = await $fetch('/api/client/profile/save', {
    method: 'PUT',
    body: {
      deliveryInfo: profileState.deliveryInfo
    } as IProfileSaveReq
  })
  if (data) {
    toast.add({
      color: 'green',
      title: 'Cập nhật thành công'
    })
    await refresh()
    initState()
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
    address: '',
    name: '',
    isDefault: false
  })
}

function removeDelivery(index: number) {
  toast.add({
    title: 'Xóa',
    actions: [
      {
        label: 'Không'
      },
      {
        label: 'Tiếp tục',
        click: () => {
          profileState.deliveryInfo!.splice(index, 1)
        }
      }
    ]
  })
}

function changeIsDefault(value: boolean, indexReq: number) {
  console.log(value)
  if (value) {
    profileState.deliveryInfo!.forEach((value, index) => {
      if (index !== indexReq) {
        value.isDefault = false
      }
    })
  }

}

</script>

<template>
  <div>
    <ClientOnly>
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
              <UFormGroup label="Họ và tên">
                <UInput disabled :model-value="profileState.name"/>
              </UFormGroup>
              <UFormGroup label="Địa chỉ email" v-if="profileState.email">
                <UInput disabled :model-value="profileState.email"/>
              </UFormGroup>
              <UFormGroup label="Thông tin nhận hàng">
                <div class="space-y-4">
                  <UCard v-for="(info, index) in profileState.deliveryInfo">
                    <template #default>
                      <div class="space-y-5">
                        <UFormGroup label="Tên">
                          <UInput v-model="info.name"/>
                        </UFormGroup>
                        <UFormGroup label="Số điện thoại">
                          <UInput v-model="info.phone"/>
                        </UFormGroup>
                        <UFormGroup label="Địa chỉ">
                          <UTextarea v-model="info.address"/>
                        </UFormGroup>
                        <div class="flex justify-between">
                          <UCheckbox label="Mặc định" v-model="info.isDefault" @change="changeIsDefault($event, index)"
                                     :id="useId()"/>
                          <UButton icon="heroicons:minus-small" variant="ghost" color="red"
                                   @click="removeDelivery(index)"/>
                        </div>
                      </div>
                    </template>
                  </UCard>
                  <div class="flex justify-end">
                    <UButton icon="heroicons:plus-20-solid" color="gray" @click="addDelivery"/>
                  </div>
                </div>
              </UFormGroup>
              <UButton type="submit" label="Cập nhật" block/>
            </UForm>
          </div>
        </template>
      </UCard>
    </ClientOnly>
  </div>
</template>

<style scoped>

</style>