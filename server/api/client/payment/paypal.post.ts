import prisma from "~/lib/prisma";
import {IPaypalReq} from "~/types/IPayment";
import _ from "lodash";
import {TOrderExchangeRate} from "~/types/TOrder";

export default defineEventHandler(async (event) => {
    const paypalRes = await readBody(event)
    const {
        id,
        create_time,
        payer,
        purchase_units,
        status,
        update_time
    } = paypalRes
    if (paypalRes && id) {
        let paymentDataInit: IPaypalReq = {} as any
        try {
            paymentDataInit.orderId = JSON.parse(purchase_units[0]?.description)?.orderId
        } catch (e) {
            console.log('JSON.parse error: ', e)
        }
        paymentDataInit.paymentMethod = 'paypal'
        paymentDataInit.transactionId = id
        paymentDataInit.amount = _.toNumber(purchase_units[0]?.amount?.value)
        paymentDataInit.currency = purchase_units[0]?.amount?.currency_code
        paymentDataInit.details = {
            payer: payer,
            payments: purchase_units[0]?.payments,
            description: purchase_units[0]?.description
        }
        paymentDataInit.status = await setStatus(status, paymentDataInit.amount, paymentDataInit.orderId)
        paymentDataInit.paymentAt = create_time
        paymentDataInit.paymentCompleteAt = update_time
        return prisma.payment.create({
            data: paymentDataInit
        });
    }
})

async function setStatus(paypalStatus: string, paypalAmount: number, orderId: string): Promise<number> {
    if (paypalStatus === 'COMPLETED') {
        const order = await prisma.order.findUnique({
            where: {
                id: orderId
            },
            select: {
                exchangeRate: true
            }
        })
        if (order) {
            const exchange = order.exchangeRate as TOrderExchangeRate
            if (paypalAmount >= exchange.USD) {
                return 1
            } else {
                return 2
            }
        } else {
            throw createError({
                statusCode: 404,
                message: 'Order not found'
            })
        }
    } else {
        return 0
    }
}