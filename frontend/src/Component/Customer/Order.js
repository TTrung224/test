import React, { useEffect, useState } from 'react';
import '../componentStyle.css';
import Loader from '../Shared/Loader';
import OrderItem from './OrderItem'
import { getCustomerOrder, updateStatusOrder } from '../../Service/OrderAPI';
import { numberFormat } from '../../Context/constants';


export async function loadItems() {
    const res = await getCustomerOrder()
    return res
}

export async function patchOrderStatus(orderId, productId, status) {
    const res = await updateStatusOrder(orderId, productId, status)
    return res
}

export default function Order() {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)

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
            }else {
                alert("Error changing status")
            }
        }).finally(setIsLoading(false))
    }


    useEffect(() => {
        loadItems().then(res => {
            if (res && res.status === 200) {
                setOrders(res.data)
            }
        }).finally(setIsLoading(false))
    }, [])

    return (
        <div class="container py-5">
            {(isLoading) ? <Loader /> : <></>}
            <div class="card">
                <div class="card-body">
                    <h2>My Orders</h2>
                    <hr className='mb-5'></hr>
                    {orders.reverse().map(ord => {
                        let totalPrice = 0
                        return (
                            <div className="card my-3" key={ord._id}>
                                <div className="card-body">
                                    <div className="table-responsive" >
                                        <h3>Order {ord._id.slice(-10)}</h3>
                                        <table className="table text-center">
                                            <thead>
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Name</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Seller</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ord.order.map(item => {
                                                    totalPrice += item.product.price * item.quantity
                                                    return <OrderItem key={item.product._id} isSeller={false} orderId={ord._id} item={item} handleChangeStatus={handleChangeStatus} />
                                                })}
                                            </tbody>
                                        </table>

                                        <h5 className='text-end mt-4 mx-5'>Total Price: {numberFormat(totalPrice)} VND</h5>
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