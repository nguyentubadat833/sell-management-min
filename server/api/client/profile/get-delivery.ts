import prisma from "~/lib/prisma";
import {IUserDeliveryInfo} from "~/types/TUser";

export default defineEventHandler(async (event) => {
    const data = await prisma.account.findUnique({
        where: {
            id: await getUserIdLogged(event)
        },
        select: {
            deliveryInfo: true
        }
    })
    if (data) {
        return data.deliveryInfo as unknown as IUserDeliveryInfo[]
    }
})