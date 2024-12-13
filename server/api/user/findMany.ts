import prisma from "~/lib/prisma";

export default defineEventHandler(async () => {
    return prisma.user.findMany().then(data => {
        return data.map(user => {
            return {
                id: user.id,

            }
        })
    })
})