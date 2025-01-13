import type {IImageInfo} from "~/types/TImage";

export interface ILocalStorageCartHistory {
    products?: string[]
}

export interface ICartDataReq {
    productIdList: string[]
}

export interface ICartDataRes {
    products?: IProductCart[]
}

export interface IProductCart {
    id: string,
    alias: string,
    name: string
    originalPrice: number | null,
    images: IImageInfo[]
    orderQuantity?: number
    selectedOrder?: boolean
}
