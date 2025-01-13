import type {ICategoryInfo} from "~/types/TCategory";
import type {IImageInfo} from "~/types/TImage";

export interface IClientSearchData {
    categories: ICategoryInfo[]
    products: {
        name: string
        alias: string
        category: {
            name: string
            alias: string
        },
        images: IImageInfo[]
    }[]
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