export default defineNuxtRouteMiddleware((to) => {
    if (to.fullPath.startsWith('/console')){
        setPageLayout('console')
    }
})