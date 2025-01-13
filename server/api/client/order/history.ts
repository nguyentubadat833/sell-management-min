import {getServerSession} from '#auth'
import prisma from "~/lib/prisma";
import {IOrderHistoryReq} from "~/types/TOrder";

export default defineEventHandler(async (event): Promise<IOrderHistoryReq[]> => {
    const session = await getServerSession(event)
    if (session && session.user && 'userId' in session) {
        return prisma.order.findMany({
            where: {
                customerId: session.userId as string,
                status: 1
            },
            orderBy: [
                {
                    orderAt: 'desc'
                }
            ],
            select: {
                id: true,
                totalAmount: true,
                shippingInfo: true,
                currency: true,
                orderAt: true,
                details: {
                    select: {
                        product: {
                            select: {
                                name: true,
                                alias: true
                            }
                        },
                        price: true,
                        quantity: true
                    }
                },
                payment: {
                    select: {
                        transactionId: true,
                        amount: true,
                        currency: true,
                        paymentMethod: true,
                        paymentAt: true,
                        status: true
                    }
                }
            }
        })
    }
    return []
})