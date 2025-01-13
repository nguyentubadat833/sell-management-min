import prisma from "~/lib/prisma";
import {IProfileRes} from "~/types/TProfile";

export default defineEventHandler(async (event): Promise<IProfileRes | null> => {
    return prisma.account.findUnique({
        where: {
            id: await getUserIdLogged(event)
        },
        select: {
            email: true,
            profile: true
        }
    });
})