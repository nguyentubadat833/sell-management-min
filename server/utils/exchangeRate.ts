import _ from "lodash";

export async function rateVNDTo() {
    const rate: any = await $fetch('https://v6.exchangerate-api.com/v6/67bf862bebc43011baa599d8/latest/VND')
    if (rate && rate?.result === 'success' && rate?.base_code === 'VND' && rate?.conversion_rates) {
        return rate!.conversion_rates
    } else {
        throw createError({
            statusCode: 404,
            message: 'No exchange rate data available'
        })
    }
}

export async function rateVNDToUSD() {
    const vndTo = await rateVNDTo()
    if (vndTo?.USD) {
        return vndTo!.USD
    } else {
        throw createError({
            statusCode: 404,
            message: 'Could not find a suitable exchange rate'
        })
    }
}

export function convertVNDToUSD(vndAmount: number, exchangeRate: number) {
    const usdAmount = vndAmount * exchangeRate;
    return _.ceil(usdAmount * 100) / 100;
}