export default defineNitroPlugin(async (nitroApp) => {
    const {auth} = useRuntimeConfig()
    if (!auth || !auth?.secret || !auth?.google || !auth?.google?.secret || !auth?.google?.id) {
        throw new Error('RuntimeConfig required auth(secret, google(id, secret))')
    }
})