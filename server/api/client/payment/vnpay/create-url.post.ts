import moment from "moment";
import * as querystring from "qs";
import prisma from "~/lib/prisma";
import {IVnpayCreateUrlReq, type IVnpayDetails} from "~/types/IPayment";
import {Prisma} from "@prisma/client";

export default defineEventHandler(async (event) => {
    const body: IVnpayCreateUrlReq = await readBody(event)
    const ipAddr = event.headers.get('x-forwarded-for') ||
        event.context.connection.remoteAddress ||
        event.context.socket.remoteAddress ||
        event.context.connection.socket.remoteAddress;

    const {paymentUrl, returnURL, tmnCode, generateSigned} = vnpayUtils()
    let vnpPaymentUrl = paymentUrl

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const tnx = moment(date).format('DDHHmmss')

    const orderId = body.orderId
    const bankCode = body?.bankCode;
    const currCode = 'VND'
    let locale = body?.language ?? 'vn'

    const orderDb = await prisma.order.findUnique({
        where: {
            id: orderId
        }
    })
    if (!orderDb) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Order not found'
        })
    }

    const orderInfo = `Payment order: ${orderDb.id}`
    const orderType = body?.orderType || 'other'
    const orderAmount = orderDb.totalAmount * 100
    let vnp_Params: any = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = tnx;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = orderAmount;
    vnp_Params['vnp_ReturnUrl'] = returnURL;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode) {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = vnpayUtils().sortObject(vnp_Params);

    vnp_Params['vnp_SecureHash'] = generateSigned(vnp_Params)
    vnpPaymentUrl += '?' + querystring.stringify(vnp_Params, {encode: false});

    await prisma.payment.create({
        data: {
            orderId: orderDb.id,
            amount: orderDb.totalAmount,
            currency: orderDb.currency,
            paymentMethod: 'vnpay',
            paymentAt: date,
            details: {
                ipAddr: ipAddr,
                tnx: tnx,
                orderInfo: orderInfo,
                orderType: orderType,
                amount: orderAmount,
                currCode: currCode,
                bankCode: bankCode ?? undefined
            } as IVnpayDetails as unknown as Prisma.JsonObject
        }
    })

    return vnpPaymentUrl
});