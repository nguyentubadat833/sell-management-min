import type {IUserProfile} from "~/types/TUser";

export interface IProfileRes {
    email?: string | null
    profile?: IUserProfile | any
}

export interface IProfileSave {
    profile?: {
        name?: string
        shippingAddress?: string
    }
}