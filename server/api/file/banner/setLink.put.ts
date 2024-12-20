import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    const {id, link} = await readBody(event)
    if (id && link) {
        await prisma.image.update({
            where: {
                id: id
            },
            data: {
                link: link
            }
        })
        setResponseStatus(event, 200)
    }
})