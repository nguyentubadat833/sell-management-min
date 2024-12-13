import {getServerSession} from '#auth'

export default defineEventHandler(async (event) => {
    console.log('tets', getRequestURL(event))
    if (getRequestURL(event).pathname.startsWith('/console')) {
        const session = await getServerSession(event)
        if (!session) {
            return sendRedirect(event, '/auth/signIn')
        }
    }

})