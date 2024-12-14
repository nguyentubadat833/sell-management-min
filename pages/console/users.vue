<script setup lang="ts">
import {Account} from '@prisma/client'

const columns = [
  {key: 'provider', label: 'Provider'},
  {key: 'email', label: 'Email'},
  {key: 'name', label: 'Name'},
  {key: 'userType', label: 'User Type'}
]

const {data} = await useFetch('/api/control/user/findMany')
</script>

<template>
  <div class="space-y-5">
    <UTable :rows="data" :columns="columns"/>
<!--    <UForm :state="formState" class="w-[30rem] mx-auto space-y-5">-->
<!--      <UFormGroup v-for="form in columns" :label="form.label">-->
<!--        <UInput v-model="formState[`${form.key}`]"/>-->
<!--      </UFormGroup>-->
<!--    </UForm>-->
  </div>
</template>