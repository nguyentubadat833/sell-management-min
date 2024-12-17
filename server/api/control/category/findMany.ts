import prisma from "~/lib/prisma";

export default defineEventHandler(async () => {
    return prisma.category.findMany({
        select: {
            id: true,
            code: true,
            name: true,
            status: true,
            createdAt: true
        }
    });
})