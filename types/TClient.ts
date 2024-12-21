export interface IIndexData {
    banner?: IBannerImages[]
    products: IProductSearch[]
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
    code: string,
    name: string,
    originalPrice: number | null,
    createdAt: any
    images: {
        name: string,
        location: string
    }[]
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

export interface IClientCategory {
    // code: string
    name: string
    alias: string
}

export interface IClientSearchData {
    categories: IClientCategory[]
    products: {
        name: string
        alias: string
        category: {
            name: string
            alias: string
        },
        images: {
            name: string,
            location: string
        }[]
    }[]
}