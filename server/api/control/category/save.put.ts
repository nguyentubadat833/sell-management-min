import prisma from "~/lib/prisma";
import {ICategoryReq} from "~/types/TCategory";
import {getUserIdLogged} from "~/server/api/utils/getAuthData";

const select = {
    id: true,
    name: true,
    status: true,
    createdAt: true
}
export default defineEventHandler(async (event) => {
    const body: ICategoryReq = await readBody(event)
    if (body?.id) {
        return prisma.category.update({
            where: {
                id: body.id
            },
            data: {
                name: body.name,
                status: body.status
            },
            select: select
        })
    } else {
        return prisma.category.create({
            data: {
                name: body.name,
                createdBy: await getUserIdLogged(event)
            },
            select: select
        })
    }
})