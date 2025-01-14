import _ from "lodash";

export default function () {
    const {vietQR} = useRuntimeConfig()
    const generateUrl = vietQR.generateQrUrl
    const clientId = vietQR.clientId
    const apiKey = vietQR.apiKey
    const bankId: number = _.toNumber(vietQR.bankId)
    const bankAccount = {
        number: vietQR.bankAccount.number,
        name: vietQR.bankAccount.name
    }
    return {
        generateUrl,
        clientId,
        apiKey,
        bankId,
        bankAccount
    }
}