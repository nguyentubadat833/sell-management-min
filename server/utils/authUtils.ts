import {getServerSession} from "#auth";
import {EventHandlerRequest, H3Event} from "h3";

export const pagePrefixRequiredAuth = [
    '/user',
    '/order',
    '/console'
]
const apiPrefixRequiredAuth = [
    '/api/control',
    '/api/file',
    '/api/client/order',
    '/api/client/payment',
    '/api/client/profile'
]
export const prefixRequiredAuth = [
    ...pagePrefixRequiredAuth,
    ...apiPrefixRequiredAuth
]

export async function getUserIdLogged(event: H3Event<EventHandlerRequest>) {
    const session = await getServerSession(event) as any
    return session?.userId ? session?.userId : 'unknown'
}