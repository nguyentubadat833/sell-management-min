import type {IProductCart} from "~/types/TClient";

export interface IOrderReq {
    id?: string
    shippingAddress: string
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
    id: string,
    currency: string,
    customerId: string,
    totalAmount: number
}

export interface ISelectedOrderSession {
    products: IProductCart[]
    totalPrice: number
}