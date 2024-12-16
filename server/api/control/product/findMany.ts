import prisma from "~/lib/prisma";

export default defineEventHandler(async () => {
    return prisma.product.findMany({
        select: {
            id: true,
            name: true,
            category: {
                select: {
                    id: true,
                    name: true,
                }
            },
            createdAt: true
        }
    });
})