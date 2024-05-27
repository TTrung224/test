import { backendUrl } from "../../Context/constants";
import "../componentStyle.css"

const SellerStatEntry = ({ stat }) => {
    let newStat = 0
    let shippedStat = 0
    let canceledStat = 0
    let acceptStat = 0
    let rejectStat = 0

    stat.statistic.forEach(s => {
        if(s.status === "New"){
            newStat = s.count
        }
        if(s.status === "Shipped"){
            shippedStat = s.count
        }
        if(s.status === "Canceled"){
            canceledStat = s.count
        }
        if(s.status === "Accept"){
            acceptStat = s.count
        }
        if(s.status === "Reject"){
            rejectStat = s.count
        }
    })

    return (
        <div className="row rounded-3 border my-3 py-2 shadow text-lg-start text-center">
            <div className="col-lg-3">
                <img src={`${backendUrl}/image/${stat.imgName}`} className="product-img mx-auto d-block img-fluid" alt='product img' />
            </div>

            <div className="col my-auto">
                <h3>{stat.name}</h3>
                <h4>Quantity Sold: {stat.quantity}</h4>
                <hr />
                <div className="row">
                    <div className="col-6 text-success">
                        <h5 className="text-dark">New: {newStat}</h5>
                        <h5>Shipped: {shippedStat}</h5>
                        <h5>Accept: {acceptStat}</h5>
                    </div>
                    <div className="col-6 text-danger">
                        <h5>Canceled: {canceledStat}</h5>
                        <h5>Reject: {rejectStat}</h5>
                    </div>
                </div>



            </div>
        </div>
    );
}

export default SellerStatEntry;