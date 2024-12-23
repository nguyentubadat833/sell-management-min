export interface IConsoleCategoryReq {
    id?: string
    name: string
    status?: number
}

export interface IConsoleCategoryRes {
    id: string,
    name: string,
    status: number
    createdAt: any
}