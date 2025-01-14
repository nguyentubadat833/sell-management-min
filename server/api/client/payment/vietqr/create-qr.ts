import {IVietQRCreateRes} from "~/types/TPayment";

export default defineEventHandler(async (event) => {
    const {generateUrl, clientId, apiKey, bankId, bankAccount} = vietQRUtils()
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
            addInfo: "Thanh toan don hang",
            amount: "79500",
            template: "compact"
        }
    })
    return response.data.qrDataURL
})