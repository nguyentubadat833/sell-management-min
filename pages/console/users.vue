<script setup lang="ts">
import {Account} from '@prisma/client'

const columns = [
  {key: 'provider', label: 'Provider'},
  {key: 'email', label: 'Email'},
  {key: 'name', label: 'Name'},
  {key: 'userType', label: 'User Type'}
]

const formState = reactive({
  provider: '',
  email: null,
  name: null,
  userType: '',
  id: NaN,
  providerId: '',
  profile: null,
  registerAt: null
})

const {data} = await useFetch('/api/control/user/findMany')

function selectUser(data: Account) {
  useAssign(formState, data)
}

</script>

<template>
  <div class="space-y-5">
    <UTable :rows="data" :columns="columns" @select="selectUser"/>
    <UForm :state="formState" class="w-[30rem] mx-auto space-y-5">
      <UFormGroup v-for="form in columns" :label="form.label">
        <UInput v-model="formState[`${form.key}`]"/>
      </UFormGroup>
      <div>
        <UButton label="Submit" type="submit" block/>
      </div>

    </UForm>
  </div>
</template>