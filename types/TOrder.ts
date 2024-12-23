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