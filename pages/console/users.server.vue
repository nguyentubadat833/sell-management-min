<script setup lang="ts">
import {User} from "@prisma/client";

const users: User[] = await usePrismaClient().user.findMany()

</script>

<template>
  <div>
    <div nuxt-client>
      <UTable  :rows="users" />
    </div>
  </div>
</template>