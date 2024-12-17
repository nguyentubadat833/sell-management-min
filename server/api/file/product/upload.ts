import prisma from "~/lib/prisma";

export default defineEventHandler(async (event): Promise<number[]> => {
    const {files} = await readBody(event)

    const result: number[] = []
    for (const file of files) {
        const image = await storeFileLocally(
            file,
            10,
            '/product'
        )
        const newImage = await prisma.image.create({
            data: {
                name: image,
                location: '/product',
                uploadBy: await getUserIdLogged(event)
            }
        })
        console.log('Uploaded: ', newImage.name)
        result.push(newImage.id)
    }

    return result
})