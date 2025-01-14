import PayOS from "@payos/node";

export default function () {
    const payOS = useRuntimeConfig().payOS
    const {clientId, apiKey, checksumKey, pageReturn} = payOS
    const instance = new PayOS(
        clientId,
        apiKey,
        checksumKey
    );
    return {
        clientId,
        apiKey,
        checksumKey,
        pageReturn,
        instance
    }
}