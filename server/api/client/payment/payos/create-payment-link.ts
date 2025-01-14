import moment from "moment/moment";
import prisma from "~/lib/prisma";
import _ from "lodash";

export default defineEventHandler(async (event) => {
    const {orderId} = getQuery(event)
    const {instance: payOS, pageReturn} = payOSUtils()
    if (_.isString(orderId)) {
        const order = await prisma.order.findUnique({
            where: {
                id: orderId
            }
        })
        if (order) {
            const date = new Date();
            const orderCode = moment(date).valueOf()
            const body = {
                orderCode: orderCode,
                amount: order.totalAmount,
                description: `Thanh toan: ${orderCode}`,
                cancelUrl: createUrl(pageReturn, {cancel: true}),
                returnUrl: createUrl(pageReturn),
            };

            try {
                return await payOS.createPaymentLink(body)
            } catch (e: any) {
                console.log('error: ', e)
                throw e
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