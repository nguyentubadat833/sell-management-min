import moment from "moment";
import * as querystring from "qs";
import * as crypto from "crypto"
import _ from "lodash";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const ipAddr = event.headers.get('x-forwarded-for') ||
        event.context.connection.remoteAddress ||
        event.context.socket.remoteAddress ||
        event.context.connection.socket.remoteAddress;

    const {paymentUrl, returnURL, tmnCode, generateSigned} = vnpayUtils()
    let vnpPaymentUrl = paymentUrl

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const bankCode = body?.bankCode;
    const orderId = body.orderId
    const orderInfo = body.orderInfo;

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

    let vnp_Params: any = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = moment(date).format('DDHHmmss');
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = orderDb.totalAmount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnURL;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode) {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = vnpayUtils().sortObject(vnp_Params);

    // let signData = querystring.stringify(vnp_Params, {encode: false});
    // let hmac = crypto.createHmac("sha512", secretKey);
    // vnp_Params['vnp_SecureHash'] = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = generateSigned(vnp_Params)
    vnpPaymentUrl += '?' + querystring.stringify(vnp_Params, {encode: false});

    return vnpPaymentUrl
});