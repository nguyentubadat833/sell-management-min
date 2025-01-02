import {getServerSession} from '#auth'
import {EUserType} from "~/types/TUser";

const prefixRequiredAuth = [
    '/user',
    '/console',
    '/api/control',
    '/api/file',
    '/api/client/order'
]
export default defineEventHandler(async (event) => {
    const pathRequest = getRequestURL(event).pathname
    if (prefixRequiredAuth.some(prefix => pathRequest.startsWith(prefix))) {
        const session = await getServerSession(event) as any
        if (!session) {
            return sendRedirect(event, '/auth/signIn')
        } else {
            if (!session?.userType || session.userType !== EUserType.CONTROL) {
                return sendRedirect(event, '/')
            }
        }
    }

})