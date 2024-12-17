import prisma from "~/lib/prisma";
import {ICategoryReq} from "~/types/TCategory";
import {getUserIdLogged} from "~/server/api/utils/getAuthData";
import {toSafeInteger} from "lodash-es";
import * as randomstring from "randomstring";

const select = {
    id: true,
    name: true,
    status: true,
    createdAt: true
}
export default defineEventHandler(async (event) => {
    const body: ICategoryReq = await readBody(event)
    if (body?.code) {
        return prisma.category.update({
            where: {
                code: body.code
            },
            data: {
                name: body.name,
                status: toSafeInteger(body?.status)
            },
            select: select
        })
    } else {
        return prisma.category.create({
            data: {
                code: 'CTG' + randomstring.generate({
                    length: 7,
                    charset: 'alphabetic'
                }).toUpperCase(),
                name: body.name,
                createdBy: await getUserIdLogged(event),
                status: toSafeInteger(body?.status)
            },
            select: select
        })
    }
})