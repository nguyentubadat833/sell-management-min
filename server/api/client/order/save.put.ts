import {IOrderDetailReq, IOrderReq} from "~/types/TOrder";
import prisma from "~/lib/prisma";
import _ from "lodash";

export default defineEventHandler(async (event) => {
    const req: IOrderReq = await readBody(event)
    const userId = await getUserIdLogged(event)
    if (!req?.id) {
        if (!req.details.length) {
            setResponseStatus(event, 204)
            return
        }
        const productsOrder = await getProductOrder(req.details)
        if (req.details.length !== productsOrder.length) {
            setResponseStatus(event, 400)
            return
        }
        return prisma.order.create({
            data: {
                customerId: userId,
                totalAmount: productsOrder.reduce((total, detail) => total + detail.originalPrice, 0),
                shippingAddress: req.shippingAddress,
                shippingMethod: req.shippingMethod,
                currency: req.currency,
                details: {
                    createMany: {
                        data: await createDetailMany(req.details, productsOrder)
                    }
                }
            },
            select: {
                id: true,
                currency: true,
                customerId: true,
                totalAmount: true
            }
        })
    } else {
        if (!req.details.length) {
            await prisma.order.update({
                where: {
                    id: req.id
                },
                data: {
                    status: 0
                }
            })
            setResponseStatus(event, 204)
            return
        } else {
            const productsOrder = await getProductOrder(req.details)
            if (req.details.length !== productsOrder.length) {
                setResponseStatus(event, 400)
                return
            }
            return prisma.$transaction(async (tx) => {
                const orderUpdate = await tx.order.update({
                    where: {
                        id: req.id,
                    },
                    data: {
                        totalAmount: productsOrder.reduce((total, detail) => total + detail.originalPrice, 0),
                        shippingAddress: req.shippingAddress,
                        shippingMethod: req.shippingMethod,
                        currency: req.currency,
                        details: {
                            createMany: {
                                data: await createDetailMany(req.details, productsOrder)
                            },
                        },
                    },
                    select: {
                        id: true,
                        currency: true,
                        customerId: true,
                        totalAmount: true
                    }
                });
                const updateDetails = await Promise.all(
                    req.details
                        .filter((detail) => detail.id) // Chỉ cập nhật các OrderDetail đã có ID
                        .map((detail) =>
                            tx.orderDetail.update({
                                where: {id: detail.id},
                                data: {
                                    productId: detail.productId,
                                    quantity: _.toSafeInteger(detail.quantity),
                                    price: productsOrder.find(e => e.id === detail.productId)!.originalPrice
                                },
                            })
                        )
                );
                return orderUpdate;
            })
        }
    }
})

async function getProductOrder(detail: IOrderDetailReq[]) {
    return prisma.product.findMany({
        where: {
            id: {
                in: detail.map(e => e.productId)
            }
        },
        select: {
            id: true,
            originalPrice: true
        }
    })
}

async function createDetailMany(details: IOrderDetailReq[], productsOrderInDb: {
    id: string,
    originalPrice: number
}[]) {
    return await Promise.all(details
        .filter(e => !e.id)
        .map(async detail => {
            return {
                productId: detail.productId,
                quantity: _.toSafeInteger(detail.quantity),
                price: productsOrderInDb.find(e => e.id === detail.productId)!.originalPrice
            };
        })
    );
}