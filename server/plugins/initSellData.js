import prisma from "~/lib/prisma.ts";

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
})