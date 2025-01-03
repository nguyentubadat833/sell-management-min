import prisma from "~/lib/prisma";
import _ from "lodash";
import {rateVNDToUSD} from "~/server/utils/exchangeRate";
import {TOrderExchangeRate} from "~/types/TOrder";

export default defineEventHandler(async (event) => {
    const {orderId} = getQuery(event)
    if (_.isString(orderId)) {
        const orderData = await prisma.order.findUnique({
            where: {
                id: orderId
            },
            select: {
                id: true,
                totalAmount: true
            }
        })
        if (orderData) {
            return prisma.order.update({
                where: {
                    id: orderData.id
                },
                data: {
                    exchangeRate: {
                        USD: convertVNDToUSD(orderData.totalAmount, await rateVNDToUSD())
                    } as TOrderExchangeRate
                },
                select: {
                    id: true,
                    totalAmount: true,
                    exchangeRate: true,
                }
            })
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