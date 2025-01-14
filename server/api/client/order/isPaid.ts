import _ from "lodash";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    const {orderId} = getQuery(event)
    if (_.isString(orderId)) {
        const order = await prisma.order.findUnique({
            where: {
                id: orderId
            },
            include: {
                payment: true
            }
        })
        if (order) {
            if (order.status === 1) {
                const payment = order?.payment
                setResponseStatus(event, 200)
                return !!(payment && payment.status === 1);
            }
        } else {
            throw createError({
                statusCode: 404,
                statusMessage: 'Order not found'
            })
        }
    } else {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid order'
        })
    }
})