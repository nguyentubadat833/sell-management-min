import prisma from "~/lib/prisma";

export default defineEventHandler(async () => {
    return prisma.order.findMany({
        where: {
            status: 1
        },
        orderBy: [
            {
                orderAt: 'desc'
            },
        ],
        include: {
            payment: true
        }
    })
})