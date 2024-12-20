import type {ILocalStorageCartHistory} from "~/types/TClient";

export const countCartProducts = ref(0)

export function cartInfo() {
    const lsKey = 'sell-cart-history'

    function addProduct(productCode: string) {
        let currentData: ILocalStorageCartHistory = {}
        if (productCode && productCode.length > 0) {
            const oldData = getLSCartHistory()
            if (oldData && isArray(oldData?.products)) {
                oldData.products.push(productCode)
                currentData.products = oldData.products
            } else {
                currentData.products = [productCode]
            }
            console.log(JSON.stringify(currentData))
            localStorage.setItem(lsKey, JSON.stringify(currentData))
        }
    }

    function getLSCartHistory(): ILocalStorageCartHistory | null {
        const data = localStorage.getItem(lsKey)
        if (data) {
            try {
                return JSON.parse(data)
            } catch (e) {
                console.log(e)
            }
        }
        return null
    }

    function getProducts() {
        const data = getLSCartHistory()
        if (data && data?.products) {
            return data.products
        } else {
            return []
        }
    }

    function countProducts() {
        const data = getLSCartHistory()
        if (data && data?.products) {
            return data.products.length
        } else {
            return 0
        }
    }

    function removeProduct(productCode: string) {
        const oldData = getLSCartHistory()
        if (oldData && oldData?.products && oldData.products.length > 0) {
            const findIndex = oldData.products.findIndex(e => e === productCode)
            oldData.products.splice(findIndex, 1)
            localStorage.setItem(lsKey, JSON.stringify(oldData))
        }
    }

    return {
        countProducts,
        addProduct,
        getProducts,
        getLSCartHistory,
        removeProduct
    }
}