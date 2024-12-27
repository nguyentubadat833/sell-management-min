export interface IConsoleCategoryReq {
    id?: string
    name: string
    status?: number
    type: ECategoryType
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

export enum ECategoryType {
    TWO_D = '2D',
    THREE_D = '3D',
}