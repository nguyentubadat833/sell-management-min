import type {IProductSearchAndSuggestion} from "~/types/TClient";
import prisma from "~/lib/prisma";

const select = {
    category: {
        select: {
            name: true,
            alias: true
        }
    },
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
export default defineEventHandler(async (event): Promise<IProductSearchAndSuggestion> => {
    const {product: productAlias} = getQuery(event)
    const res: IProductSearchAndSuggestion = {
        suggestion: []
    }
    const product = await prisma.product.findUnique({
        where: {
            alias: productAlias as string,
        },
        select: select
    })
    if (product) {
        res.product = product
        res.suggestion = await prisma.product.findMany({
            select: select,
            take: 10,
            orderBy: [
                {
                    createdAt: 'desc'
                }
            ],
            where: {
                category: {
                    alias: res.product?.category.alias
                }
            },
        })
        if (res.suggestion.length < 10) {
            const target = 10 - res.suggestion.length
            const targetResult = await prisma.product.findMany({
                orderBy: [
                    {
                        createdAt: 'desc'
                    }
                ],
                take: target,
                select: select
            })
            res.suggestion = [...res.suggestion, ...targetResult]
        }
        return res
    } else {
        res.suggestion = await prisma.product.findMany({
            orderBy: [
                {
                    createdAt: 'desc'
                }
            ],
            take: 10,
            select: select
        })
        return res
    }
})