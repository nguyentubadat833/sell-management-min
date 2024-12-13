import {EUserType} from "~/types/TUser";

export default defineNuxtRouteMiddleware((to, from) => {
    if (to.fullPath === '/auth/signIn'){
        return navigateTo(`/auth/signIn?redirectUrl=${encodeURIComponent(from.fullPath)}`);
    }
})