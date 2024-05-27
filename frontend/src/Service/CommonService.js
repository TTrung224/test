import { ADMIN, CUSTOMER, SELLER } from "../constants"


export const handleAuth = (isAuthenticated, userTypeUpper) => {
    const guestPath = ["cart", "product"]
    const userPath = ["order"]
    const sellerPath = ["seller"]
    const adminPath = ["admin"]
    const path = window.location.pathname.split("/")[1]

    if ((path === "login" || path === "signup")) {
        if (isAuthenticated) {
            return false
        } else return true
    }
    if (path === "logout") {
        if (!isAuthenticated) {
            return false
        } else return true
    }
    if (sellerPath.some(p => path.includes(p))) {
        if (userTypeUpper === SELLER) {
            return true
        } return false
    }
    else if (adminPath.some(p => path.includes(p))) {
        if (userTypeUpper === ADMIN) {
            return true
        } return false
    }
    else if (userPath.some(p => path.includes(p))) {
        if (userTypeUpper === CUSTOMER) {
            return true
        } return false
    }
    else if (guestPath.some(p => path.includes(p)) || path === "") {
        if (userTypeUpper === ADMIN || userTypeUpper === SELLER) {
            return false
        }
        return true
    }
}

