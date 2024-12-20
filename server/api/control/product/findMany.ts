import prisma from "~/lib/prisma";

export default defineEventHandler(async () => {
    return prisma.product.findMany({
        select: {
            id: true,
            code: true,
            name: true,
            originalPrice: true,
            status: true,
            createdAt: true,
            category: {
                select: {
                    id: true,
                    name: true,
                }
            },
            images: {
                select: {
                    id: true,
                    name: true,
                    location: true
                }
            }
        }
    })
})