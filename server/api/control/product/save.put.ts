import prisma from "~/lib/prisma";
import {getUserIdLogged} from "~/server/api/utils/getAuthData";
import {IProductReq} from "~/types/TProduct";

const select = {
    id: true,
    name: true,
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
                categoryId: body.categoryId
            },
            select: select
        })
    } else {
        return prisma.product.create({
            data: {
                name: body.name,
                categoryId: body.categoryId,
                createdBy: await getUserIdLogged(event)
            },
            select: select
        })
    }
})