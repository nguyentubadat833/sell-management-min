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
export interface IVnpayCreateUrlReq {
    orderId: string,
    bankCode?: string,
    language?: 'vn' | 'en',
    orderType?: string
}
export interface IVnpayDetails{
    ipAddr: string,
    currCode: string,
    tnx: string
    orderInfo: string,
    orderType: string
    amount: number
    bankCode?: string
}