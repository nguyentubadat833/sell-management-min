export interface IIndexData {
    banner?: IBannerImages[]
    products: any[]
}

export interface IBannerImages {
    name: string
    location: string
    link?: string | null
}