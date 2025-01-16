import {TPaymentMethod} from "~/types/TPayment";

export default defineEventHandler(async (event) => {
    const requestApi = getRequestURL(event).pathname
    if (requestApi.startsWith('/api/client/payment')) {
        const appAcceptPaymentMethods = useRuntimeConfig(event).public.acceptPaymentMethods as TPaymentMethod[]
        const requestApiSplit = requestApi.split('/')
        if (requestApiSplit.length >= 4 && appAcceptPaymentMethods) {
            const methodRequest = requestApiSplit[4]
            const findMethod = appAcceptPaymentMethods.find(e => e === methodRequest)
            if (!findMethod) {
                throw createError({
                    statusCode: 403,
                    statusMessage: 'This payment method is not available for you'
                })
            }
        }
    }
})