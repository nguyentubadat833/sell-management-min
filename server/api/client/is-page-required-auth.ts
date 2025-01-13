import {pagePrefixRequiredAuth} from "~/server/utils/authUtils";

export default defineEventHandler(async (event) => {
    const requestURL = getRequestURL(event)
    if (pagePrefixRequiredAuth.some(prefix => requestURL.pathname.startsWith(prefix))) {
        await sendRedirect(event, '/', 302)
    }
})