import prisma from "~/lib/prisma";

export default defineEventHandler(async () => {
    return prisma.order.findMany({
        orderBy: [
            {
                orderAt: 'desc'
            },
        ]
    })
})