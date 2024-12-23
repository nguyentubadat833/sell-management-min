import type {ILocalStorageCartHistory} from "~/types/TClient";
import type {IOrderReq} from "~/types/TOrder";

export const countCartProducts = ref(0)

export function cartInfo() {
    const lsKey = 'sell-cart-history'
    const toast = useToast()

    function addProduct(productId: string) {
        let currentData: ILocalStorageCartHistory = {}
        if (productId && productId.length > 0) {
            const oldData = getLSCartHistory()
            if (oldData && isArray(oldData?.products)) {
                if (oldData.products.includes(productId)) {
                    toast.add({title: 'Đã có trong giỏ hàng', color: 'blue', timeout: 2000})
                    return
                } else {
                    oldData.products.push(productId)
                    currentData.products = oldData.products
                }
            } else {
                currentData.products = [productId]
            }
            localStorage.setItem(lsKey, JSON.stringify(currentData))
            countCartProducts.value = cartInfo().countProducts()
            toast.add({title: 'Đã thêm vào giỏ hàng', timeout: 1000})
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

    function clearData() {
        localStorage.removeItem(lsKey)
    }

    return {
        countProducts,
        addProduct,
        getProducts,
        getLSCartHistory,
        removeProduct,
        clearData
    }
}