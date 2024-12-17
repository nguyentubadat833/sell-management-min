export interface IProductReq {
    id?: number
    name: string
    categoryId: number,
    originalPrice?: number
    status?: number
    images?: number[]
}

export interface IProductRemoveImage {
    productId: number
    imageId: number
}