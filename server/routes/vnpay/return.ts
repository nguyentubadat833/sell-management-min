export default defineEventHandler(async (event) => {
    let vnp_Params = getQuery(event);

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = vnpayUtils().sortObject(vnp_Params);

    if (secureHash === vnpayUtils().generateSigned(vnp_Params)) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        console.log('code:', vnp_Params['vnp_ResponseCode'])
        // res.render('success', {code: vnp_Params['vnp_ResponseCode']})
        return sendRedirect(event, `/payment/vnpay_return?code=${vnp_Params['vnp_ResponseCode']}`)
    } else {
        // res.render('success', {code: '97'})
        return sendRedirect(event, `/payment/vnpay_return?code=${vnp_Params['vnp_ResponseCode']}`)
    }
})