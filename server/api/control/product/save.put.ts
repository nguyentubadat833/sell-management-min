import prisma from "~/lib/prisma";
import {Prisma, Product} from '@prisma/client'

import {getUserIdLogged} from "~/server/api/utils/getAuthData";
import {IProductReq} from "~/types/TProduct";
import {toSafeInteger} from "lodash-es";

const select: Prisma.ProductSelect = {
    id: true,
    name: true,
    originalPrice: true
}
export default defineEventHandler(async (event) => {
    const body: IProductReq = await readBody(event)
    if (body?.id) {
        return prisma.product.update({
            where: {
                id: body.id
            },
            data: {
                name: body.name,
                categoryId: body.categoryId,
                originalPrice: body?.originalPrice ? parseFloat(String(body.originalPrice)) : undefined,
                status: toSafeInteger(body.status)
            },
            select: select
        })
    } else {
        return prisma.product.create({
            data: {
                name: body.name,
                categoryId: body.categoryId,
                originalPrice: body?.originalPrice ? parseFloat(String(body.originalPrice)) : undefined,
                status: body?.status ? toSafeInteger(body.status) : undefined,
                createdBy: await getUserIdLogged(event)
            },
            select: select
        })
    }
})