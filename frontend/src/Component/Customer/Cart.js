import React, { useContext, useEffect, useRef, useState } from 'react';
import '../componentStyle.css';
import Loader from '../Shared/Loader';
import CartItem from './CartItem';
import { AuthContext } from '../../Context/LoginSessionContext';
import { loadCartItems, updateCart } from '../../Service/CartAPI';
import { useNavigate } from "react-router-dom";
import { createOrder } from '../../Service/OrderAPI';
import StatusModal from '../Shared/StatusModal';
import { numberFormat } from '../../Context/constants';


export default function Cart() {
    const { authState: { isAuthenticated } } = useContext(AuthContext)
    const navigate = useNavigate()
    const [cart, setCart] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [orderModal, setOrderModal] = useState({show: false, success: false})
    const firstRender = useRef(true)

    // Handle delete products
    function deleteProduct(id) {
        const newCart = cart.filter(item => item.product._id !== id)
        setCart(newCart)
    }
    function deleteAll() {
        if (cart.isEmpty) {
            return
        }
        setCart([])
    }

    // Handle order button pressed
    function handleOrder(isAuthenticated) {
        if (!isAuthenticated) {
            return navigate("/login")
        }
        if (!cart.length) {
            alert("No item in cart")
            return
        }
        setIsLoading(true)
        createOrder(cart)
            .then(res => {
                if(res && res.status === 201){
                    setOrderModal({show: true, success: true})
                    setCart([])
                }else{
                    setOrderModal({show: true, success: false})
                }
            })
            .finally(() => setIsLoading(false))
    }

    // Load cart on initial load
    useEffect(() => {
        loadCartItems(isAuthenticated).then(data => {
            setCart(data)
        }).finally(setIsLoading(false))
    }, [isAuthenticated])

    // Save cart if cart state changes
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            return
        }
        if (isAuthenticated) {
            updateCart(cart).then(res => {
                if (!res) {
                    alert("Error updating cart")
                } else {
                    localStorage.setItem("cart", JSON.stringify(cart))
                }
            })
        } else {
            localStorage.setItem("cart", JSON.stringify(cart))
        }

    }, [cart, isAuthenticated])

    // Return render components
    return (
        <div className="container py-5 h-100">
            {isLoading ? <Loader /> : <></>}
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col">
                    <div className="card">

                        <div className="card-body">
                            <div className="row">
                                <div className="col">
                                    <h2>Shopping Cart</h2>
                                    <hr></hr>

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <button type="button" className="btn btn-danger" onClick={() => deleteAll()}>Delete All</button>
                                    </div>

                                    <hr></hr>

                                    {(isLoading) ? <Loader /> : <></>}
                                    {cart.map(item => <CartItem key={item.product.id} item={item} deleteProduct={deleteProduct} cart={cart} setCart={setCart} />)}

                                </div>
                                <div className="col-lg-4" >
                                    <div className="p-5">
                                        <h3>Order Summary</h3>

                                        <div className="d-flex justify-content-between">
                                            <p>Item Counts</p>
                                            <p>{cart.length} items</p>
                                        </div>

                                        <div className="d-flex justify-content-between">
                                            <p><b>Total</b></p>
                                            <p><b>{numberFormat (cart.reduce((acc, next) => acc += next.product.price * next.quantity, 0))} VND</b></p>
                                        </div>

                                        <div className="d-flex justify-content-between">
                                            <button type="button" className="btn btn-success btn-block btn-lg " onClick={() => handleOrder(isAuthenticated)}>Confirm Order</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <StatusModal modal={orderModal} setModal={setOrderModal} successMsg={"Order Created!"} failMsg={"Create Order Failed."} />
        </div>
    )
}