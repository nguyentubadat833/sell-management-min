export interface IIndexData {
    banner?: IBannerImages[]

}

export interface IBannerImages {
    name: string
    location: string
    link?: string | null
}