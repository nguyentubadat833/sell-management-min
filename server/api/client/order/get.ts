import prisma from "~/lib/prisma";
import _ from "lodash";
import {IOrderInfoRes} from "~/types/TOrder";

export default defineEventHandler(async (event): Promise<IOrderInfoRes | null> => {
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