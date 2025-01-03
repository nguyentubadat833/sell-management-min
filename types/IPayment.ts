export type paymentMethod = 'paypal' | 'vnpay'

export interface IPaypalReq {
    orderId: string
    transactionId: string
    amount: number
    currency: string
    paymentMethod: paymentMethod
    details: {
        payer: any
        payments: any
        description: any
    }
    status: number
    paymentAt: any
    paymentCompleteAt?: any
}