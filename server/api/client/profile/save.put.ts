import prisma from "~/lib/prisma";
import {IProfileSaveReq, IUserDeliveryInfo, IUserProfile} from "~/types/TUser";
import {Prisma} from "@prisma/client";

export default defineEventHandler(async (event) => {
    const body: IProfileSaveReq = await readBody(event)
    const userId = await getUserIdLogged(event)
    body.deliveryInfo = validateDeliveryInfo(body.deliveryInfo)
    const data = await prisma.account.update({
        where: {
            id: userId
        },
        data: {
            deliveryInfo: body.deliveryInfo as unknown as Prisma.JsonArray
        }
    })
    if (data) {
        return 'success'
    }
})

function validateDeliveryInfo(deliveryInfo: IUserDeliveryInfo[]) {
    if (deliveryInfo.length > 1) {
        const defaultCount = deliveryInfo.filter(item => item.isDefault).length;
        if (defaultCount > 1) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Duplicate default delivery'
            })
        } else if (!defaultCount) {
            deliveryInfo[0].isDefault = true
        }
    } else if (deliveryInfo.length === 1) {
        deliveryInfo[0].isDefault = true
    }
    return deliveryInfo
}