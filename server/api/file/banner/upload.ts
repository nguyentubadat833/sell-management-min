export default defineEventHandler(async (event): Promise<number[]> => {
    return await uploadImage(event, '/banner')
})