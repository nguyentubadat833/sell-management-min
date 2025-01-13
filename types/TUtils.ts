import type {IBannerImages} from "~/types/TImage";
import type {IProductSearch} from "~/types/TSearch";

export interface IIndexData {
    banner?: IBannerImages[]
    products: IProductSearch[]
}

// export interface IOrderRes {
//     totalAmount: number
//     currency: string
// }



