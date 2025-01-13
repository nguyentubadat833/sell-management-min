export enum EUserType {
    CONTROL = "CONTROL",
    CUSTOMER = "CUSTOMER",
}

export enum EAuthProvider {
    GOOGLE = "GOOGLE"
}

export interface IProfileRes {
    email?: string | null
    profile: IUserProfile
    deliveryInfo?: IUserDeliveryInfo[]
}

export interface IProfileSaveReq {
    deliveryInfo: IUserDeliveryInfo[]
}

export interface IUserProfile {
    name: string
    avatar?: string
}

export interface IUserDeliveryInfo {
    name: string
    phone: string
    address: string
    email: string
    isDefault: boolean
}