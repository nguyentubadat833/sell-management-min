import prisma from "~/lib/prisma";
import {toSafeInteger} from "lodash-es";
import * as randomstring from "randomstring";
import slug from "slug";
import {IConsoleCategoryReq} from "~/types/TCategory";

const select = {
    id: true,
    name: true,
    status: true,
    createdAt: true
}
export default defineEventHandler(async (event) => {
    const body: IConsoleCategoryReq = await readBody(event)
    if (body?.id) {
        return prisma.category.update({
            where: {
                id: body.id
            },
            data: {
                name: body.name,
                status: toSafeInteger(body?.status),
                // type: body.type,
                parentId: body.parentId,
                childrenIds: body.childrenIds
            },
            select: select
        })
    } else {
        return prisma.category.create({
            data: {
                id: 'CTG' + randomstring.generate({
                    length: 7,
                    charset: 'alphabetic'
                }).toUpperCase(),
                name: body.name,
                // type: body.type,
                parentId: body.parentId,
                childrenIds: body.childrenIds,
                alias: slug(body.name),
                createdBy: await getUserIdLogged(event),
                status: toSafeInteger(body?.status) ?? 1
            },
            select: select
        })
    }
})