export default defineEventHandler(async (event): Promise<string[]> => {
    return await uploadImage(event, '/product')
})