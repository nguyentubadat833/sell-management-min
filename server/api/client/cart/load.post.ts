import prisma from "~/lib/prisma";
import {ICartDataReq, ICartDataRes} from "~/types/TCart";

export default defineEventHandler(async (event): Promise<ICartDataRes> => {
    const {productIdList} = await readBody(event) as ICartDataReq
    let res: ICartDataRes = {}
    res.products = await prisma.product.findMany({
        where: {
            id: {
                in: productIdList
            }
        },
        select: {
            id: true,
            alias: true,
            name: true,
            originalPrice: true,
            images: {
                select: {
                    name: true,
                    location: true
                }
            }
        }
    })
    return res
})