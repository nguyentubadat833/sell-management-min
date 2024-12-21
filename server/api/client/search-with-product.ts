import type {IProductSearch} from "~/types/TClient";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event): Promise<IProductSearch | null> => {
    const {product: productAlias} = getQuery(event)
    if (!productAlias) return null
    return prisma.product.findUnique({
        where: {
            alias: productAlias as string,
        },
        select: {
            code: true,
            name: true,
            originalPrice: true,
            createdAt: true,
            images: {
                select: {
                    name: true,
                    location: true
                }
            }
        }
    }) ?? null

})