import prisma from "~/lib/prisma";

export default defineEventHandler(async () => {
    return prisma.product.findMany({
        include: {
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