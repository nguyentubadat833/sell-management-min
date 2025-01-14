import {IVietQRCreateRes} from "~/types/TPayment";
import prisma from "~/lib/prisma";
import _ from "lodash";

export default defineEventHandler(async (event) => {
    const {orderId} = getQuery(event)
    if (_.isString(orderId)) {
        const {generateUrl, clientId, apiKey, bankId, bankAccount} = vietQRUtils()
        const order = await prisma.order.findUnique({
            where: {
                id: orderId
            }
        })
       if (order){
           // @ts-ignore
           const response: IVietQRCreateRes = await $fetch(generateUrl, {
               headers: {
                   'x-client-id': clientId,
                   'x-api-key': apiKey,
                   'Content-Type': 'application/json'
               },
               method: 'POST',
               body: {
                   accountNo: bankAccount.number,
                   accountName: bankAccount.name,
                   acqId: bankId,
                   addInfo: `Thanh toan don hang: ${order.id}`,
                   amount: `${order.totalAmount}`,
                   template: "compact"
               }
           })
           return response.data.qrDataURL
       }else {
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