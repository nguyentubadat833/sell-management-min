import * as querystring from "qs";
import crypto from "crypto";

export default function () {
    const {vnPay, public: publicENV} = useRuntimeConfig()
    const tmnCode = vnPay.tmnCode
    const secretKey = vnPay.secretKey
    const paymentUrl = vnPay.paymentUrl
    const returnURL = publicENV.vnPay.returnUrl

    function generateSigned(vnp_Params: any) {
        let signData = querystring.stringify(vnp_Params, {encode: false});
        let hmac = crypto.createHmac("sha512", secretKey);
        return hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    }

    function sortObject(obj: any) {
        let sorted: any = {};
        let str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }

    return {
        tmnCode,
        secretKey,
        paymentUrl,
        returnURL,
        sortObject,
        generateSigned
    }
}