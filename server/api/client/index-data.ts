import prisma from "~/lib/prisma";
import {IIndexData} from "~/types/TClient";

export default defineEventHandler(async (): Promise<IIndexData> => {
    const indexData: IIndexData = {products: []}
    
    indexData.banner = await prisma.image.findMany({
        where: {
            location: '/banner'
        },
        select: {
            name: true,
            location: true,
            link: true
        }
    })
    indexData.products = await prisma.product.findMany({
        where: {
            status: 1
        },
        select: {
            code: true,
            name: true,
            originalPrice: true,
            createdAt: true,
            category: {
                select: {
                    alias: true,
                    name: true,
                }
            },
            images: {
                select: {
                    // id: true,
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
    return indexData
})