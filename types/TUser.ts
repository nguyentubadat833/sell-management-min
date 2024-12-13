export enum EUserType {
    SYSTEM = "SYSTEM",
    ADMIN = "ADMIN",
    CUSTOMER = "CUSTOMER",
    SALES = "SALES"
}

export interface IUserProfile {
    name: string
    email?: string
    avatar?: string
}