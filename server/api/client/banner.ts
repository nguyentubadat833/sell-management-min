import prisma from "~/lib/prisma";

export default defineEventHandler(async () => {
    return prisma.image.findMany({
        where: {
            location: '/banner'
        }
    });
})