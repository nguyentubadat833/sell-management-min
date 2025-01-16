import chalk from "chalk";
import {TPaymentMethod} from "~/types/TPayment";
import _ from "lodash";

export default defineNitroPlugin(async (nitroApp) => {
    const runtimeConfig = useRuntimeConfig()
    const envAcceptMethods = runtimeConfig.public.acceptPaymentMethods as TPaymentMethod[]
    if (!_.isArray(envAcceptMethods) || !envAcceptMethods.length) {
        console.log(chalk.yellow("Warning. No payment methods are allowed."))
    } else {
        const {paypal, payOS, vnPay} = runtimeConfig
        envAcceptMethods.forEach(e => {
            if (e === 'paypal') {
                if (!paypal || !paypal?.clientId) {
                    throw new Error('RuntimeConfig required clientId')
                }
            } else if (e === 'vnpay') {
                if (!vnPay || !vnPay?.tmnCode || !vnPay?.secretKey || !vnPay?.paymentUrl) {
                    throw new Error('RuntimeConfig required vnPay(tmnCode, secretKey, paymentUrl)')
                }
            } else if (e === 'payos') {
                if (!payOS || !payOS?.clientId || !payOS?.apiKey || !payOS?.pageReturn || !payOS.checksumKey) {
                    throw new Error('RuntimeConfig required payOS(clientId, apiKey, pageReturn, checksumKey)')
                }
            }
        })
        console.log(chalk.green(`Accept payment methods: ${envAcceptMethods}`))
    }
})