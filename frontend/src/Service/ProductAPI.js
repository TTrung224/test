import { axiosSetting } from "../Context/constants"

export async function getAllProducts(filters) {
    try {
        const data = await axiosSetting.get(`/product?` +
            `page=${filters.page}&` +
            `maxPerPage=${filters.maxPerPage}&` +
            `search=${filters.search}&` +
            `category=${filters.category}&` +
            `minPrice=${filters.minPrice}&` +
            `maxPrice=${filters.maxPrice}&` +
            `minDate=${filters.minDate}&` +
            `maxDate=${filters.maxDate}&` +
            `attributes=${filters.attributes.join(",")}&` +
            `isUpdateAttribute=${filters.isUpdateAttribute}`)
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function getProduct(productId) {
    try {
        const data = await axiosSetting.get(`/product/item/${productId}`)
        return data
    } catch (error) {
        console.log(error.message)
        return null
    }
}

export async function getUserProducts(userId) {
    try {
        const data = await axiosSetting.get(`/product/seller/${userId}`)
        return data
    } catch (error) {
        console.log(error.message)
        return null
    }
}

export async function getProductStat() {
    try {
        const data = await axiosSetting.get("/product/statistic")
        return data
    } catch (error) {
        console.log(error.message)
        return null
    }
}

export async function createProduct(formData) {
    try {
        const res = await axiosSetting.post("/product/add", formData)
        return res
    } catch (error) {
        console.log(error.message)
        return null
    }
}

export async function saveProduct(productId, formData) {
    try {
        const res = await axiosSetting.post(`/product/edit/${productId}`, formData)
        return res
    } catch (error) {
        console.log(error.message)
        return null
    }
}

export async function deleteProduct(productId) {
    try {
        const res = await axiosSetting.delete(`product/delete/${productId}`)
        return res
    } catch (error) {
        console.log(error)
        return null
    }
}
