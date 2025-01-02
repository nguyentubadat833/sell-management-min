export interface IIndexData {
    banner?: IBannerImages[]
    products: IProductSearch[]
}

export interface IImageInfo {
    name: string,
    location: string
}

export interface IBannerImages {
    name: string
    location: string
    link?: string | null
}

export interface ISearchProductWithCategoryAlias {
    categoryName: string
    products: IProductSearch[]
}

export interface IProductSearch {
    id: string,
    category: ICategoryInfo
    alias: string
    name: string,
    originalPrice: number | null,
    createdAt: any
    images: IImageInfo[]
}

export interface IProductSearchAndSuggestion {
    product?: IProductSearch
    suggestion: IProductSearch[]
}

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

export interface ICategoryInfo {
    // code: string
    name: string
    alias: string
}

export interface IClientSearchData {
    categories: ICategoryInfo[]
    products: {
        name: string
        alias: string
        category: ICategoryInfo,
        images: IImageInfo[]
    }[]
}

export interface IOrderRes {
    totalAmount: number
    currency: string
}