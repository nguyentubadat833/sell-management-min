import prisma from "~/lib/prisma";

export default defineEventHandler(async () => {
    return prisma.account.findMany({
        select: {
            id: true,
            provider: true,
            email: true,
            name: true,
            userType: true,
            // profile: true
        }
    })
})