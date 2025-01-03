export enum EUserType {
    SYSTEM = "SYSTEM",
    CONTROL = "CONTROL",
    CUSTOMER = "CUSTOMER",
}

export enum EAuthProvider {
    GOOGLE = "GOOGLE"
}

export interface IUserProfile {
    name?: string
    avatar?: string
}