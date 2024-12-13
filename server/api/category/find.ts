import prisma from "~/lib/prisma";

export default defineEventHandler(async () => {
    return prisma.category.findMany();
})
