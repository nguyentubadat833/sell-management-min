<script setup lang="ts">
// Remember to disable the middleware protection from your page!
definePageMeta({
  auth: {unauthenticatedOnly: true, navigateAuthenticatedTo: '/'}
})

const {signIn, getProviders} = useAuth()
// const providers = await getProviders()
// console.log(providers)

const redirectUrl: any = useRoute().query?.redirectUrl || '/';
signIn('google', {
  redirect: true,
  callbackUrl: redirectUrl
});
</script>

<template>
  <div>
    <!--    <button v-for="provider in providers" :key="provider.id" @click="signIn(provider.id)">-->
    <!--      Sign in with {{ provider.name }}-->
    <!--    </button>-->
  </div>
</template>