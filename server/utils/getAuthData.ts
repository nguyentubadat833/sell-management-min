import {getServerSession} from "#auth";
import {EventHandlerRequest, H3Event} from "h3";

export async function getUserIdLogged(event: H3Event<EventHandlerRequest>) {
    const session = await getServerSession(event) as any
    return session?.userId ? session?.userId : 'unknown'
}