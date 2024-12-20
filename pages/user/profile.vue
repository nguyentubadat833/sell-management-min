<script setup lang="ts">
const {data: authData, signOut} = useAuth()
console.log(authData.value)
</script>

<template>
  <div>
    <UCard v-if="authData?.user && authData.user?.email">
      <template #header>
        <div class="flex items-center gap-2">
          <UAvatar :src="authData?.user?.image" alt="A" size="md"/>
          <span class="text-xl font-bold">{{ authData?.user?.name }}</span>
        </div>
      </template>
      <template #default>
        <div class="min-h-[50vh]">
          <UForm class="w-96 mx-auto space-y-7">
            <UFormGroup label="Email">
              <UInput disabled v-model="authData.user.email"/>
            </UFormGroup>
            <UFormGroup label="Phone">
              <UInput/>
            </UFormGroup>
<!--            <UFormGroup label="Delivery address">-->
<!--              <UTextarea/>-->
<!--            </UFormGroup>-->
            <UButton type="submit" label="Submit" block/>
          </UForm>
        </div>
      </template>
    </UCard>
  </div>
</template>

<style scoped>

</style>