import prisma from "~/lib/prisma";
import {type ISearchProductWithCategoryAlias} from "~/types/TClient";

export default defineEventHandler(async (event): Promise<ISearchProductWithCategoryAlias | null> => {
    const {alias} = getQuery(event)
    if (alias) {
        return prisma.category.findUnique({
            where: {
                alias: alias as string
            },
            select: {
                name: true,
                Product: {
                    select: {
                        alias: true,
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
                }
            }
        }).then(data => {
            return {
                categoryName: data?.name,
                products: data?.Product
            } as ISearchProductWithCategoryAlias
        });
    }
    return null
})