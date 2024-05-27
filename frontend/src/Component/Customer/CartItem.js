import React, { useEffect, useRef, useState } from 'react';
import CountQuantity from './CountQuantity';
import { backendUrl, numberFormat } from '../../Context/constants';
// import DeleteProduct from './removeProduct';

const CartItem = ({ item, deleteProduct, cart, setCart }) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const firstRender = useRef(true)
    const product = item.product

    // Handle change quantity
    // enlint-disable-next-line
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            return
        }
        
        const newCart = cart.map(i => {
            if(i.product._id === product._id){
                i.quantity = quantity
            }
            return i
        })
        setCart(newCart)
        // eslint-disable-next-line
    }, [quantity])

    return (
        <div className="row mb-4 d-flex justify-content-between align-items-center">
            <div className="col-md-2 col-lg-2 col-xl-2">
                <img
                    src={backendUrl + `/image/${product.imgName}`}
                    className="img-fluid" style={{ maxHeight: "100px" }}
                    alt='product' />
            </div>

            <div className="col-md-3 col-lg-3 col-xl-3">
                <h6 className="text-black mb-0">{product.name}</h6>
            </div>
            <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                <CountQuantity quantity={quantity} setQuantity={setQuantity} ></CountQuantity>
            </div>
            <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                <h6 className="mb-0">{numberFormat(product.price)} VND</h6>

            </div>

            <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                <button type="button" class="btn" onClick={() => deleteProduct(product._id)}>X</button>
            </div>

        </div>
    );

}
export default CartItem;