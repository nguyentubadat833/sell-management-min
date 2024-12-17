import prisma from "~/lib/prisma";

export default defineEventHandler(async () => {
    return prisma.warehouse.findMany()
})