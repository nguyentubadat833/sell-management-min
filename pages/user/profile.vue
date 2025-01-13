<script setup lang="ts">
const {data: getProfile} = await useFetch('/api/client/profile/get')
</script>

<template>
  <div>
    <UCard v-if="getProfile">
      <template #header>
        <div class="flex items-center gap-2">
          <UAvatar :src="getProfile?.profile?.avatar" alt="A" size="md"/>
          <span class="text-xl font-bold">{{ getProfile?.profile?.name }}</span>
        </div>
      </template>
      <template #default>
        <div class="min-h-[50vh]">
          <UForm class="w-96 mx-auto space-y-7">
            <UFormGroup label="Name">
              <UInput v-model="getProfile.profile.name"/>
            </UFormGroup>
            <UFormGroup label="Email">
              <UInput disabled v-model="getProfile.email"/>
            </UFormGroup>
            <UFormGroup label="Shipping address">
              <UTextarea v-model="getProfile.profile.shippingAddress"/>
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