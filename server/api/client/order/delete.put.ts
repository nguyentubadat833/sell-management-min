import prisma from "~/lib/prisma";
import _ from "lodash";

export default defineEventHandler(async (event) => {
    const {id} = getQuery(event)
    if (_.isString(id)) {
        const data = await prisma.order.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                status: true,
                payment: {
                    select: {
                        status: true
                    }
                }
            }
        }).then(data => {
            if (data?.status === 1 && (!data?.payment || !data?.payment?.status)) {
                return data
            } else {
                return null
            }
        })
        if (data) {
            await prisma.order.update({
                where: {
                    id: data.id
                },
                data: {
                    status: 0
                }
            })
            setResponseStatus(event, 200)
            return 'success'
        }
    }
    setResponseStatus(event, 400)
})