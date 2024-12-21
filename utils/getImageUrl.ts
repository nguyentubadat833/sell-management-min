import type {IImageInfo} from "~/types/TClient";

export function getProductImageUrl(imageInfo: IImageInfo) {
    return joinPath('/images', imageInfo.location, imageInfo.name)
}