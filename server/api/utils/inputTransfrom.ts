const toSafeInt = (value: any) => {
    if (typeof value === "string" && /^\d+$/.test(value)) {
        return parseInt(value, 10);
    }
    return undefined
};