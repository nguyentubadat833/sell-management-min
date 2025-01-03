import prisma from "~/lib/prisma";
import {IOrderRes} from "~/types/TClient";
import _ from "lodash";

export default defineEventHandler(async (event): Promise<IOrderRes | null> => {
    const {id} = getQuery(event)
    if (_.isString(id)) {
        return prisma.order.findUnique({
            where: {
                id: id
            },
            select: {
                currency: true,
                totalAmount: true,
            }
        })
    } else {
        throw createError({
            statusCode: 400,
            message: 'Invalid order'
        })
    }
})