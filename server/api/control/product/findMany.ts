import prisma from "~/lib/prisma";

export default defineEventHandler(async () => {
    return prisma.product.findMany({
        include: {
            category: true
        }
    });
})