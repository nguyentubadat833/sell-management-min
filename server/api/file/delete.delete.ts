import prisma from "~/lib/prisma";
import {IProductRemoveImage} from "~/types/TProduct";
import {rm} from "fs/promises";
import path from "node:path";
import _ from "lodash";

export default defineEventHandler(async (event) => {
    const {productId, imageId}: IProductRemoveImage = getQuery(event)
    const imageIdReal = _.toSafeInteger(imageId)
    console.log(imageIdReal)
    const imageData = await prisma.image.findUnique({
        where: {
            id: imageIdReal
        }
    })
    if (imageData) {
        const storageRoot = useRuntimeConfig().app.fileStorageRoot
        try {
            const result = await prisma.image.delete({
                where: {
                    id: imageIdReal
                }
            })
            await rm(path.join(storageRoot, imageData.location, imageData.name))
            if (result) {
                return result
            }
        } catch (e) {
            console.log('Delete image error: ', e)
        }


    }

    // const result = await prisma.product.update({
    //     where: {
    //         id: productId
    //     },
    //     data: {
    //         images: {
    //             deleteMany: {
    //                 id: imageId
    //             }
    //         }
    //     },
    //     select: {
    //         id: true
    //     }
    // })
    setResponseStatus(event, 400)
})