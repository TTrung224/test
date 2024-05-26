import { useEffect, useState } from 'react';
import { getSellerOrder } from '../../Service/OrderAPI';
import Loader from '../Shared/Loader';
import OrderItem from '../Customer/OrderItem';
import { patchOrderStatus } from '../Customer/Order';

async function loadOrders() {
    const res = await getSellerOrder()
    return res
}

export default function OrderList() {
    const [isLoading, setIsLoading] = useState(true)
    const [orders, setOrders] = useState([])

    function handleChangeStatus(orderId, productId, status) {
        setIsLoading(true)
        patchOrderStatus(orderId, productId, status).then(res => {
            if (res && res.status === 200) {
                const newOrders = orders.map((o) => {
                    if (o._id === orderId) {
                        const order = o.order
                        const newOrder = order.map(p => {
                            if (p.product._id === productId) {
                                p.status = status
                            }
                            return p
                        })
                        o.order = newOrder
                    }
                    return o
                })
                setOrders(newOrders)
            } else {
                alert("Error changing status")
            }
        }).finally(setIsLoading(false))
    }

    useEffect(() => {
        loadOrders().then(res => {
            if (res && res.status === 200) {
                setOrders(res.data)
            }
        }).finally(setIsLoading(false))
    }, [])


    return (
        <div className="container my-5">
            {isLoading ? <Loader /> : <></>}
            <div className="card shadow">
                <div className="card-body">
                    <h2>Order Management</h2>
                    <hr className='mb-5'></hr>

                    {orders.reverse().map(ord => {
                        return (
                            <div className="card my-3" key={ord._id}>
                                <div className="card-body">
                                    <div className="table-responsive" >
                                        <h3>Order {ord._id.slice(-10)}</h3>
                                        <h5>Customer: {ord.customer.fullName}</h5>
                                        <h6>Address: {ord.customer.address}</h6>
                                        <table className="table text-center">
                                            <thead>
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Name</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ord.order.map(item => {
                                                    return <OrderItem key={item.product._id} isSeller={true} orderId={ord._id} item={item} handleChangeStatus={handleChangeStatus} />
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>

    )
}