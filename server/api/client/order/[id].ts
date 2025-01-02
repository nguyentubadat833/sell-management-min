import prisma from "~/lib/prisma";
import {IOrderRes} from "~/types/TClient";

export default defineEventHandler(async (event): Promise<IOrderRes | null> => {
    const id = getRouterParam(event, 'id')
    return prisma.order.findUnique({
        where: {
            id: id
        },
        select: {
            currency: true,
            totalAmount: true,
        }
    })
})