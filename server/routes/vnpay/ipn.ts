import _ from "lodash";
import prisma from "~/lib/prisma";
import {Prisma} from "@prisma/client";
import moment from "moment";
import chalk from "chalk";
import {IVnPayDetails} from "~/types/TPayment";

export default defineEventHandler(async (event) => {
    let vnp_Params = getQuery(event)
    // console.log('params: ', vnp_Params)
    const secureHashReq = vnp_Params['vnp_SecureHash'] as string
    const amountReq = _.toNumber(vnp_Params['vnp_Amount'])
    const bankCodeReq = vnp_Params['vnp_BankCode'] as string
    const txnRefReq = vnp_Params['vnp_TxnRef'] as string
    const orderInfoReq = vnp_Params['vnp_OrderInfo'] as string
    const payDateReq = vnp_Params['vnp_PayDate'] as string
    const transactionNoReq = vnp_Params['vnp_TransactionNo'] as string
    // const transactionStatusReq = vnp_Params['vnp_TransactionStatus'] as string
    const rspCodeReq = vnp_Params['vnp_ResponseCode'] as string

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = vnpayUtils().sortObject(vnp_Params);
    if (secureHashReq === vnpayUtils().generateSigned(vnp_Params)) {
        const orderIdReq = orderInfoReq.split(' ').pop()
        const orderData = await prisma.order.findUnique({
            where: {
                id: orderIdReq
            },
            include: {
                payment: true
            }
        })
        const orderDbStatus = orderData?.status
        const paymentDb = orderData?.payment
        const paymentDbStatus = paymentDb?.status
        let vnpayDetailsDb = paymentDb?.details as unknown as IVnPayDetails
        vnpayDetailsDb!.bankCode = bankCodeReq
        if (orderData && orderDbStatus === 1 && paymentDb && vnpayDetailsDb?.tnx === txnRefReq) {
            if (vnpayDetailsDb.amount === amountReq) {
                if (paymentDbStatus === 0) {
                    if (rspCodeReq == "00") {
                        await prisma.payment.update({
                            where: {
                                orderId: paymentDb.orderId,
                            },
                            data: {
                                transactionId: transactionNoReq,
                                amount: amountReq / 100,
                                status: 1,
                                details: vnpayDetailsDb as unknown as Prisma.JsonObject,
                                paymentCompleteAt: moment(payDateReq, "YYYYMMDDHHmmss").format()
                            }
                        })
                        console.log(chalk.green('Payment Success'))
                        return {RspCode: '00', Message: 'Success'}
                    } else {
                        console.log('Error')
                        return {RspCode: '02', Message: 'Payment Error'}
                    }
                } else {
                    console.log('This order has been updated to the payment status')
                    return {RspCode: '02', Message: 'This order has been updated to the payment status'}
                }
            } else {
                console.log('Amount invalid')
                await prisma.payment.update({
                    where: {
                        orderId: paymentDb.orderId,
                    },
                    data: {
                        transactionId: transactionNoReq,
                        amount: amountReq / 100,
                        status: 2,
                        details: vnpayDetailsDb as unknown as Prisma.JsonObject,
                        paymentCompleteAt: moment(payDateReq, "YYYYMMDDHHmmss").format()
                    }
                })
                return {RspCode: '04', Message: 'Amount invalid'}
            }
        } else {
            console.log('Order not found')
            return {RspCode: '01', Message: 'Order not found'}
        }
    } else {
        console.log('Checksum failed')
        return {RspCode: '97', Message: 'Checksum failed'}
    }
})