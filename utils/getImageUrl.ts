import type {IImageInfo} from "~/types/TImage";

export function getProductImageUrl(imageInfo: IImageInfo) {
    return joinPath('/images', imageInfo.location, imageInfo.name)
}