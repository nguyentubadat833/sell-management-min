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
    category: ICategoryInfo
    code: string,
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
    productCodeList: string[]
}

export interface ICartDataRes {
    products?: {
        code: string,
        name: string
        originalPrice: number | null,
        images: IImageInfo[]
    }[]
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