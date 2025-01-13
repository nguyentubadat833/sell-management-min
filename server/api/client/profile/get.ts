import {IProfileRes} from "~/types/TClient";
import prisma from "~/lib/prisma";

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