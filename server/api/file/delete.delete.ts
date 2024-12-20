import prisma from "~/lib/prisma";
import {IProductRemoveImage} from "~/types/TProduct";
import {rm} from "fs/promises";
import path from "node:path";
import _ from "lodash";

export default defineEventHandler(async (event) => {
    const {imageId}: IProductRemoveImage = getQuery(event)
    const imageIdReal = _.toSafeInteger(imageId)
    const imageData = await prisma.image.findUnique({
        where: {
            id: imageIdReal
        }
    })
    if (imageData) {
        const storageRoot = useRuntimeConfig().app.fileStorageRoot
        try {
            await rm(path.join(storageRoot, imageData.location, imageData.name))
            const result = await prisma.image.delete({
                where: {
                    id: imageIdReal
                }
            })
            if (result) {
                return result
            }
        } catch (e) {
            console.log('Delete image error: ', e)
        }


    }
    setResponseStatus(event, 400)
})