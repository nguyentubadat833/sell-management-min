import prisma from "~/lib/prisma";
import {IClientSearchData} from "~/types/TClient";

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
            name: true,
            // code: true,
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