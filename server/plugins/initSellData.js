import prisma from "~/lib/prisma.ts";
import slug from "slug";

export default defineNitroPlugin(async (nitroApp) => {
    const isUseWareHouse = useRuntimeConfig().app.isUseWarehouse
    if (isUseWareHouse || isUseWareHouse === 'true') {
        const findWarehouse = await prisma.warehouse.upsert({
            where: {
                name: 'Kho Hồ Chí Minh'
            },
            create: {
                name: 'Kho Hồ Chí Minh',
                createdBy: 0
            },
            update: {}
        })
        console.log('Created warehouse: ', findWarehouse)
    }

    // const products = await prisma.product.findMany({
    //     select: {
    //         id: true,
    //         name: true
    //     }
    // })
    // for (const product of products) {
    //     await prisma.product.update({
    //         where: {
    //             id: product.id
    //         },
    //         data: {
    //             alias: slug(product.name)
    //         }
    //     })
    // }
})