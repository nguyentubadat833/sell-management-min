import moment from "moment/moment";
import prisma from "~/lib/prisma";
import _ from "lodash";
import {IPayOSDetails} from "~/types/TPayment";

export default defineEventHandler(async (event) => {
    const {orderId} = getQuery(event)
    const {instance: payOS, pageReturn} = payOSUtils()
    if (_.isString(orderId)) {
        const order = await prisma.order.findUnique({
            where: {
                id: orderId
            },
            select: {
                id: true,
                totalAmount: true,
                payment: true
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
            const payOSOrder = (order?.payment?.details as unknown as IPayOSDetails)?.order
            try {
                const payOSPaymentCheckout = await payOS.createPaymentLink(body)
                return payOSPaymentCheckout
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