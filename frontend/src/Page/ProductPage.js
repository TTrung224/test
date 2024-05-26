import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Component/Shared/Navbar";
import CountQuantity from "../Component/Customer/CountQuantity";
import { useContext, useEffect, useState } from "react";
import { getProduct } from "../Service/ProductAPI";
import { backendUrl, numberFormat } from "../Context/constants";
import Loader from "../Component/Shared/Loader";
import { AuthContext } from "../Context/LoginSessionContext";
import { loadCartItems, updateCart } from "../Service/CartAPI";
import StatusModal from "../Component/Shared/StatusModal";


async function loadProduct(id) {
    const res = await getProduct(id)
    return res
}

async function handleAddToCart(isAuthenticated, product, quantity) {
    let alreadyAdded = false

    // get current cart
    let cart = await loadCartItems(isAuthenticated)
    console.log(cart)
    // if item exist, on change quantity
    cart = cart.map(item => {
        if (item.product._id === product._id) {
            alreadyAdded = true
            item.quantity = quantity
        }
        return item
    })

    // if not, add to cart array
    if (!alreadyAdded) {
        cart.push({ product: product, quantity: quantity })
    }

    // add to local storage

    // if authenticated add to database also
    if (isAuthenticated) {
        const res = await updateCart(cart)
        if (res && res.status === 200) {
            localStorage.setItem("cart", JSON.stringify(cart))
        } else {
            return false
        }
    } else {
        localStorage.setItem("cart", JSON.stringify(cart))
    }
    return true
}

const ProductPage = () => {
    const { authState } = useContext(AuthContext)
    const { productId } = useParams()
    const [quantity, setQuantity] = useState(1)
    const [product, setProduct] = useState(null)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [cartModal, setCartModal] = useState({ show: false, success: false })

    useEffect(() => {
        loadProduct(productId).then(res => {
            if (res) {
                if (res.status === 200) {
                    setProduct(res.data)
                }
            }
        }).finally(() => { setIsLoading(false) })
    }, [productId])

    return (
        <>
            <Navbar />
            {isLoading ? <Loader /> : <></>}
            {product !== null ?
                <div className="container">
                    <div className="row mt-5 p-3 shadow">
                        <div className="col-lg-3 col-12 border align-self-center p-3">
                            <img className="product-image img-fluid mx-auto d-block" src={backendUrl + `/image/${product.imgName}`} alt="product" />
                        </div>

                        <div className="col-lg-9">
                            <h2>{product.name}</h2>
                            <hr />

                            <h3 className="text-primary">{numberFormat(product.price)} VND</h3>


                            <div className="d-inline-flex mt-2">
                                <p className="text-sm-start text-secondary my-auto me-3">Category:</p>
                                <p className="text-sm-start my-auto">{product.category.name}</p>
                            </div>
                            <br />
                            <div className="d-inline-flex mt-3">
                                <p className="text-sm-start text-secondary my-auto me-3">Quantity:</p>
                                <CountQuantity quantity={quantity} setQuantity={setQuantity} />
                            </div>


                            <div className="mt-3">
                                <button type="button" className="btn btn-lg btn-primary me-3" onClick={() => {
                                    handleAddToCart(authState.isAuthenticated, product, quantity).then(res => {
                                        setCartModal({ show: true, success: res })
                                        navigate("/cart")
                                    })
                                }}>Buy Now</button>
                                <button type="button" className="btn btn-lg btn-outline-primary" onClick={() => {
                                    setIsLoading(true)
                                    handleAddToCart(authState.isAuthenticated, product, quantity).then(res => {
                                        setCartModal({ show: true, success: res })
                                        setIsLoading(false)
                                    })
                                }}>Add To Cart</button>
                            </div>

                        </div>
                        <div className="container mt-5">
                            <p><b>Date Added: </b> {Date(product.createdAt)}</p>
                            <ul className="list-group">
                                {product.attributes.map(a => {
                                    return (
                                        <li className="list-group-item">
                                            <h5 class="mb-1">{a.attribute.name}</h5>
                                            <small class="text-body-secondary">{a.value}</small>
                                        </li>
                                    )
                                })}
                            </ul>
                            <div className="my-4">
                                <h3 className="">Description:</h3>
                                <p style={{ whiteSpace: "pre-wrap" }}>{product.description}</p>
                            </div>
                        </div>
                    </div>

                </div> : <></>
            }

            <StatusModal modal={cartModal} setModal={setCartModal} successMsg={"Item added to your cart."} failMsg={"Failed to add to cart."} />
        </>
    );
}

export default ProductPage;