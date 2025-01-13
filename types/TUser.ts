export enum EUserType {
    CONTROL = "CONTROL",
    CUSTOMER = "CUSTOMER",
}

export enum EAuthProvider {
    GOOGLE = "GOOGLE"
}

export interface IUserProfile {
    name?: string
    avatar?: string
    shippingAddress?: string
}