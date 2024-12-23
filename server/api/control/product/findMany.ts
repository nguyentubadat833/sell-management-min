import prisma from "~/lib/prisma";
import {IConsoleProductRes} from "~/types/TProduct";

export default defineEventHandler(async (): Promise<IConsoleProductRes[]> => {
    return prisma.product.findMany({
        select: {
            id: true,
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
                    name: true,
                    location: true
                }
            }
        }
    })
})