export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.hook('vue:error', (err: any) => {
        showError({
            statusCode: err.statusCode,
            statusMessage: err.statusMessage,
            message: err.message
        })
    })
})
