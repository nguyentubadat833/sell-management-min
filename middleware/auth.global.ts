import {EUserType} from "~/types/TUser";

export default defineNuxtRouteMiddleware((to, from) => {
    if (to.fullPath === '/auth/signIn') {
        let redirectUrl: string
        if (to.fullPath !== from.fullPath) {
            redirectUrl = from.fullPath
        } else {
            redirectUrl = '/'
        }
        return navigateTo(`/auth/signIn?redirectUrl=${encodeURIComponent(redirectUrl)}`);
    }
})