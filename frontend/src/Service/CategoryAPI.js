import { axiosSetting } from "../Context/constants"

export async function getCategories() {
    const res = await axiosSetting.get("/category")
    return res
}

export async function getCategoryWithParents(id) {
    const res = await axiosSetting.get(`/category/${id}`)
    return res
}

export async function addCategory(category) {
    try {
        const res = await axiosSetting.post("/category/add", category)
        return res
    } catch(err){
        if(err.code === "ERR_BAD_REQUEST"){
            alert("dupplicate category name or attributes")
        }else{
            alert("Couldn't add category")
        }
    }
}

export async function updateCategory(id, category) {
    try{
        const res = await axiosSetting.put(`/category/edit/${id}`, category)
        return res
    } catch(err){
        if(err.code === "ERR_BAD_REQUEST"){
            alert("dupplicate category name or attributes")
        }else{
            alert("Couldn't update category")
        }
    }
}

export async function deleteCategory(id) {
    const res = await axiosSetting.delete(`/category/delete/${id}`)
    return res
}