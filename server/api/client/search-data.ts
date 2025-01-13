import prisma from "~/lib/prisma";
import {IClientSearchData} from "~/types/TSearch";

export default defineEventHandler(async (): Promise<IClientSearchData> => {
    let res: IClientSearchData = {
        categories: [],
        products: []
    }
    res.categories = await prisma.category.findMany({
        where: {
            status: 1
        },
        select: {
            id: true,
            parentId: true,
            name: true,
            alias: true
        }
    })
    res.products = await prisma.product.findMany({
        where: {
            status: 1
        },
        select: {
            name: true,
            alias: true,
            category: {
                select: {
                    name: true,
                    alias: true
                }
            },
            images: {
                select: {
                    name: true,
                    location: true
                }
            }
        },
        orderBy: [
            {
                createdAt: 'desc'
            }
        ]
    })
    return res
})