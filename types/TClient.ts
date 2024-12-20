export interface IIndexData {
    banner?: IBannerImages[]
    products: any[]
}

export interface IBannerImages {
    name: string
    location: string
    link?: string | null
}

export interface ILocalStorageCartHistory {
    products?: string[]
}

export interface ICartDataReq {
    productCodeList: string[]
}

export interface ICartDataRes {
    products?: {
        code: string,
        name: string
        originalPrice: number | null,
        images: {
            name: string
            location: string
        }[]
    }[]
}