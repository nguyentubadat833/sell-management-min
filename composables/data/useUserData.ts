import type { User } from "@prisma/client";

const users = ref<User[]>([])
export default {
    users
}