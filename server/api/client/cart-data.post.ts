import prisma from "~/lib/prisma";
import {ICartDataReq, type ICartDataRes} from "~/types/TClient";

export default defineEventHandler(async (event): Promise<ICartDataRes> => {
    const {productCodeList} = await readBody(event) as ICartDataReq
    let res: ICartDataRes = {}
    res.products = await prisma.product.findMany({
        where: {
            code: {
                in: productCodeList
            }
        },
        select: {
            alias: true,
            code: true,
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