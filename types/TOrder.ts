import type {IProductCart} from "~/types/TCart";

export interface IOrderShippingInfo {
    name: string
    address: string
    phone: string
    email: string
}

export interface IOrderReq {
    id?: string
    shippingInfo: IOrderShippingInfo
    shippingMethod: string
    currency: string
    details: IOrderDetailReq[]
}

export interface IOrderDetailReq {
    id?: number
    productId: string
    quantity: number
}

export interface IOrderRes {
    id: string
    currency: string
    customerId: string
    totalAmount: number
}

export interface IOrderInfoRes {
    currency: string
    totalAmount: number
}


export interface ISelectedOrderSession {
    products: IProductCart[]
    totalPrice: number
}

export interface IOrderHistoryReq {
    id: string
    totalAmount: number
    shippingInfo: any | IOrderShippingInfo
    currency: string
    orderAt: any
    details: {
        product: {
            name: string
            alias: string
        },
        price: number
        quantity: number
    }[],
    payment?: {
        transactionId?: string | null
        amount?: number | null
        currency?: string | null
        paymentMethod: string
        paymentAt: any
        status: number
    } | null
}

export type TOrderExchangeRate = {
    USD: number
}