import {EUserType} from "~/types/TUser";
import prisma from "~/lib/prisma";
import chalk from "chalk";

export default defineNitroPlugin(async (nitroApp) => {
    const isUseWareHouse = useRuntimeConfig().app.isUseWarehouse
    if (isUseWareHouse || isUseWareHouse === 'true') {
        console.log(chalk.green('The application allows warehouse usage'))
        const findWarehouse = await prisma.warehouse.upsert({
            where: {
                name: 'Kho Hồ Chí Minh'
            },
            create: {
                name: 'Kho Hồ Chí Minh',
                createdBy: EUserType.SYSTEM
            },
            update: {}
        })
        console.log(chalk.green('Initialized warehouse: ', findWarehouse.name))
    }
})