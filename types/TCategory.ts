export interface IConsoleCategoryReq {
    id?: string
    name: string
    status?: number
    parentId?: string
    childrenIds?: any
}

export interface IConsoleCategoryRes {
    id: string,
    name: string
    status: number
    parentId: string | null
    createdAt: any
}

export interface ICategoryMenuTreeItem {
    alias: string
    label: string
    click: any
    children?: ICategoryMenuTreeItem[];
}

export interface ICategoryInfo {
    id: string
    parentId?: string | null
    name: string
    alias: string
}
