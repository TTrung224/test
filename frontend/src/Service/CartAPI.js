import { axiosSetting } from "../Context/constants";

export async function loadCartItems(isAuthenticated) {

    let cartList = []
    const ls = localStorage.cart
    if (ls) {
        cartList = JSON.parse(localStorage.cart)
    }


    if (isAuthenticated) {
        const res = await getCartItems()
        if(res && res.status === 200){
            if(!res.data.length && cartList.length){
                await updateCart(cartList)
                return loadCartItems(isAuthenticated)
            }
            return res.data
        } else {
            alert("Error loading cart from database")
        }
    }

    return cartList
}


export async function getCartItems() {
    try {
        const res = await axiosSetting.get("/account/cart")
        return res
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function updateCart(cart) {
    try {
        const res = await axiosSetting.post("account/cart/update", cart)
        return res
    } catch (error) {
        console.log(error)
        return null
    }
}




