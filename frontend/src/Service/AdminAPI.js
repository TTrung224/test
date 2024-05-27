import { axiosSetting } from "../Context/constants"

export async function getSellers() {
    try{
        const res = await axiosSetting.get("account/seller-request")
        if(res.status === 200){
            console.log(res)
            return res.data
        }else{
            return[]
        }
    } catch(error){
        return[]
    }
}

export async function saveSeller(id, status) {
    try{
        const res = await axiosSetting.put(`account/seller-request/${id}`, {sellerStatus: status})
        if(res.status !== 200){
            return {success: false}
        }
    } catch(error){
        return {success: false}
    }
    return {success: true}
}

