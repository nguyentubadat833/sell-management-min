export interface IConsoleCategoryReq {
    id?: string
    name: string
    status?: number
    parentId?: string
    childrenIds?: any
}

export interface IConsoleCategoryRes {
    id: string,
    name: string,
    status: number
    type: string
    leftId?: string | null
    rightId?: string | null
    createdAt: any
}