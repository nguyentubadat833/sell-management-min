import prisma from "~/lib/prisma";
import {Prisma} from '@prisma/client'
import {toSafeInteger} from "lodash-es";
import slug from "slug";
import randomstring from "randomstring";
import {IConsoleProductReq} from "~/types/TProduct";

const select: Prisma.ProductSelect = {
    id: true,
    name: true,
    originalPrice: true
}
export default defineEventHandler(async (event) => {
    const body: IConsoleProductReq = await readBody(event)
    if (body?.id) {
        return prisma.product.update({
            where: {
                id: body.id
            },
            data: {
                name: body.name,
                alias: slug(body.name),
                categoryId: body.categoryId,
                originalPrice: body?.originalPrice ? parseFloat(String(body.originalPrice)) : undefined,
                status: toSafeInteger(body.status),
                images: body?.images && body.images.length > 0 ? {
                    connect: body.images.map(imageName => {
                        return {
                            name: imageName
                        }
                    })
                } : undefined
            },
            select: select
        })
    } else {
        return prisma.product.create({
            data: {
                id: 'PRD' + randomstring.generate({
                    length: 8,
                    charset: 'alphabetic'
                }).toUpperCase(),
                name: body.name,
                alias: slug(body.name),
                categoryId: body.categoryId,
                originalPrice: parseFloat(String(body.originalPrice)),
                status: body?.status ? toSafeInteger(body.status) : undefined,
                createdBy: await getUserIdLogged(event),
                images: body?.images && body.images.length > 0 ? {
                    connect: body.images.map(imageName => {
                        return {
                            name: imageName
                        }
                    })
                } : undefined
            },
            select: select
        })
    }
})