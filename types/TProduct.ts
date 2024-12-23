export interface IConsoleProductReq {
    id?: string
    name: string
    categoryId: string,
    originalPrice?: number
    status?: number
    images?: string[]
}

export interface IConsoleProductRes {
    id: string
    name: string
    originalPrice: number | null
    status: number
    createdAt: any
    category: {
        id: string
        name: string
    },
    images: {
        name: string
        location: string
    }[]

}

export interface IProductRemoveImage {
    productId: string
    imageName: string
}