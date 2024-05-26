import { useEffect, useState } from "react"
import { getProductStat } from "../../Service/ProductAPI"
import Loader from "../Shared/Loader"
import SellerStatEntry from "./SellerStatEntry"

async function loadStat() {
    const res = getProductStat()
    return res
}

export default function Statistic() {
    const [stat, setStat] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadStat().then(res => {
            if (res) {
                setStat(res.data)
            }
        }).finally(setIsLoading(false))
        // eslint-disable-next-line
    }, [])

    return (
        <div className="container my-5">
            {isLoading ? <Loader /> : <></>}
            <h2>Product Statistic</h2>
            <hr className='mb-5'></hr>
            {stat.map(s => {
                return <SellerStatEntry key={s._id} stat={s} />
            })}
        </div>

    )
}