import { backendUrl, numberFormat } from "../../Context/constants";

const OrderItem = ({ isSeller, orderId, item, handleChangeStatus }) => {
    const product = item.product


    const statusButtons = () => {
        if (item.status === "Shipped" && !isSeller) {
            return (
                <>
                    <button className="btn btn-success btn-sm d-block w-100 my-1" onClick={() => handleChangeStatus(orderId, product._id, "Accept")}>Accept</button>
                    <button className="btn btn-danger btn-sm d-block w-100 my-1" onClick={() => handleChangeStatus(orderId, product._id, "Reject")}>Reject</button>
                </>
            )
        }
        if (item.status === "New" && isSeller) {
            return (
                <>
                    <button className="btn btn-success btn-sm d-block w-100 my-1" onClick={() => handleChangeStatus(orderId, product._id, "Shipped")}>Shipped</button>
                    <button className="btn btn-danger btn-sm d-block w-100 my-1" onClick={() => handleChangeStatus(orderId, product._id, "Canceled")}>Canceled</button>
                </>
            )
        }

        let textClass = ""
        if(item.status === "Accept" || item.status === "Shipped"){ textClass = "text-success" }
        if(item.status === "Canceled" || item.status === "Reject"){ textClass = "text-danger" }
        
        return (<p className={textClass}>{item.status}</p>
        )
    }
    return (
        <tr className="align-middle">
            <td style={{ width: "150px" }}>
                <img
                    src={backendUrl + `/image/${product.imgName}`} alt="product"
                    className="img-fluid" style={{ maxHeight: "100px" }} />
            </td>
            <td>{product.name}</td>
            <td>{numberFormat(product.price)} VND</td>
            <td>{item.quantity}</td>
            {isSeller ? <></> : <td> {product.seller.fullName}</td>}
            <td><b>{statusButtons()}</b></td>
        </tr>
    );

}



export default OrderItem;