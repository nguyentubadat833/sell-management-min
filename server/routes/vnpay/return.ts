export default defineEventHandler(async (event) => {
    let vnp_Params = getQuery(event);

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = vnpayUtils().sortObject(vnp_Params);
    const code = vnp_Params['vnp_ResponseCode']
    if (secureHash === vnpayUtils().generateSigned(vnp_Params)) {
        return sendRedirect(event, `/payment/vnpay_return?isValid=true&code=${code}`)
    } else {
        return sendRedirect(event, `/payment/vnpay_return?code=${code}`)
    }
})