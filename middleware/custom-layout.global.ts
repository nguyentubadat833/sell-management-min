export default defineNuxtRouteMiddleware((to) => {

    if (to.fullPath.startsWith('/console')) {
        setPageLayout('console')
    } else if (to.fullPath.startsWith('/auth')) {
        setPageLayout('auth')
    }
})