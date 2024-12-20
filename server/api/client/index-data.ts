import prisma from "~/lib/prisma";
import {IIndexData} from "~/types/TClient";

export default defineEventHandler(async () => {
    const indexData: IIndexData = {}
    indexData.banner = await prisma.image.findMany({
        where: {
            location: '/banner'
        },
        select: {
            name: true,
            location: true,
            link: true
        }
    })
    return indexData
})