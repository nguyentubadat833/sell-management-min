<script setup lang="ts">

import type {IProfileRes, IProfileSaveReq, IUserDeliveryInfo} from "~/types/TUser";

const {data: authData} = useAuth()
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
  deliveryInfo: IUserDeliveryInfo[]
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
    isDefault: false,
    email: authData.value?.user?.email || ''
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
      <div class="md:w-96 mx-auto space-y-4">
        <UDivider label="Thông tin tài khoản"/>
        <div class="space-y-3">
          <UFormGroup label="Họ và tên">
            <UInput disabled :model-value="profileState.name"/>
          </UFormGroup>
          <UFormGroup label="Địa chỉ email" v-if="profileState.email">
            <UInput disabled :model-value="profileState.email"/>
          </UFormGroup>
        </div>
        <UDivider label="Thông tin giao nhận"/>
        <div class="space-y-5">
          <div v-for="(info, index) in profileState.deliveryInfo" class="p-3 border shadow rounded-md">
            <div class="space-y-3">
              <UInput v-model="info.name" placeholder="Tên"/>
              <UInput v-model="info.email" placeholder="Địa chỉ email"/>
              <UInput v-model="info.phone" placeholder="Số điện thoại"/>
              <UTextarea v-model="info.address" placeholder="Địa chỉ"/>
              <div class="flex justify-between">
                <UCheckbox label="Mặc định" v-model="info.isDefault" @change="changeIsDefault($event, index)"
                           :id="useId()"/>
                <UButton icon="heroicons:minus-small" variant="ghost" color="red"
                         @click="removeDelivery(index)"/>
              </div>
            </div>
          </div>
        </div>
        <UButton color="gray" label="Thêm địa chỉ" @click="addDelivery()" block/>
        <UButton label="Cập nhật" @click="save" block/>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.card-header {
  @apply text-lg font-bold
}
</style>