import prisma from "~/lib/prisma";
import {IConsoleCategoryRes} from "~/types/TCategory";

export default defineEventHandler(async (): Promise<IConsoleCategoryRes[]> => {
    return prisma.category.findMany({
        select: {
            id: true,
            name: true,
            status: true,
            createdAt: true
        }
    });
})