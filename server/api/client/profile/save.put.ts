import {IProfileSaveReq} from "~/types/TProfile";
import prisma from "~/lib/prisma";
import {IUserProfile} from "~/types/TUser";

export default defineEventHandler(async (event) => {
    const body: IProfileSaveReq = await readBody(event)
    const userId = await getUserIdLogged(event)
    const profile = await prisma.account.findUnique({
        where: {
            id: userId
        },
        select: {
            profile: true
        }
    }).then(data => data?.profile as IUserProfile)
    profile.name = body.name
    profile.shippingAddress = body.shippingAddress
    const result = await prisma.account.update({
        where: {
            id: userId
        },
        data: {
            profile: {
                ...profile
            }
        }
    })
    if (result) {
        return result.id
    }
})