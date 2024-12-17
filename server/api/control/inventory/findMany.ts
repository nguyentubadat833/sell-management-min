import prisma from "~/lib/prisma";

export default defineEventHandler(async () => {
    return prisma.stock.findMany({
        include: {
            product: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
})