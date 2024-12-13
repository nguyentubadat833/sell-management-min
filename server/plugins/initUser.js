import {EUserType} from "~/types/TUser.ts";
import prisma from "~/lib/prisma.ts";

export default defineNitroPlugin(async (nitroApp) => {
    await prisma.user.upsert({
        where: {
            email: 'nguyentubadat@gmail.com'
        },
        create: {
            email: 'nguyentubadat@gmail.com',
            userType: EUserType.ADMIN,
            createdBy: EUserType.SYSTEM
        },
        update: {}
    })
})