export interface IProductReq {
    id?: number
    name: string
    categoryId: number,
    originalPrice?: number
    status?: number
    images?: number[]
}