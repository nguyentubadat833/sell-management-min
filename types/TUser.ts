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

export interface IUserSession {
    name?: string | null
    email?: string | null
    avatar?: string | null
    userType?: EUserType | null
}