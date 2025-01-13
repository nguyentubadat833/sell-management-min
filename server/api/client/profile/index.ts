import prisma from "~/lib/prisma";
import {IProfileRes, IUserDeliveryInfo, IUserProfile} from "~/types/TUser";

export default defineEventHandler(async (event): Promise<IProfileRes> => {
    const data = await prisma.account.findUnique({
        where: {
            id: await getUserIdLogged(event)
        },
        select: {
            email: true,
            profile: true,
            deliveryInfo: true
        }
    })
    if (data){
        return {
            email: data.email,
            profile: data.profile as unknown as IUserProfile,
            deliveryInfo: data.deliveryInfo as unknown as IUserDeliveryInfo[]
        }
    }else {
        throw createError({
            statusCode: 401,
            statusMessage: 'User not found'
        })
    }
})