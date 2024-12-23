import prisma from "~/lib/prisma";
import {IProductRemoveImage} from "~/types/TProduct";
import {rm} from "fs/promises";
import path from "node:path";
import _ from "lodash";

export default defineEventHandler(async (event) => {
    const {imageName}: IProductRemoveImage = getQuery(event)
    const imageData = await prisma.image.findUnique({
        where: {
            name: imageName
        }
    })
    if (imageData) {
        const storageRoot = useRuntimeConfig().app.fileStorageRoot
        try {
            await rm(path.join(storageRoot, imageData.location, imageData.name))
            const result = await prisma.image.delete({
                where: {
                    name: imageName
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