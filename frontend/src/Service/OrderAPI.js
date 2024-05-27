import { axiosSetting } from "../Context/constants";

export async function getCustomerOrder(){
    try {
        const res = await axiosSetting.get("order")
        return res
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function getSellerOrder() {
    try {
        const res = await axiosSetting.get("/order/seller")
        return res
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function createOrder(cart){
    try {
        const res = await axiosSetting.post("order/create", cart)
        return res
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function updateStatusOrder(orderId, productId, status){
    try {
        const res = await axiosSetting.patch(`order/${orderId}/${productId}?status=${status}`)
        return res
    } catch (error) {
        console.log(error)
        return null
    }
}
