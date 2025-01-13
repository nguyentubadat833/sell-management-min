import type {IUserProfile} from "~/types/TUser";

export interface IProfileRes {
    email?: string | null
    profile: IUserProfile | any
}

export interface IProfileSaveReq {
    name: string
    shippingAddress: string
}