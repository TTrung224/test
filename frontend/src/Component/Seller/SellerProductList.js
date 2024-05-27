import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { backendUrl, numberFormat } from '../../Context/constants';
import Loader from '../Shared/Loader';
import "../componentStyle.css"
import { deleteProduct, getUserProducts } from '../../Service/ProductAPI';
import { AuthContext } from '../../Context/LoginSessionContext';
import Modal from 'react-bootstrap/Modal';

async function loadProducts(user) {
    if (!user) {
        return []
    }
    const res = await getUserProducts(user._id)
    if (res && res.status === 200) {
        return res.data
    } else { return [] }
}

async function removeProduct(productId) {
    const res = await deleteProduct(productId)
    return res
}

export default function SellerProductList() {
    const { authState: { user } } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [deleteModal, setDeleteModal] = useState({ show: false, productId: "" })
    const [search, setSearch] = useState("")
    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [minDate, setMinDate] = useState("")
    const [maxDate, setMaxDate] = useState("")
    const isVerified = user.sellerStatus === "accepted"
    
    useEffect(() => {
        loadProducts(user).then(prod => {
            setProducts(prod)
        }).finally(setIsLoading(false))
    }, [user])


    // DELETE HANDLE
    const handleDelete = (id) => {
        setIsLoading(true)
        removeProduct(id).then(res => {
            if (res) {
                if (res.status === 200) {
                    const newProducts = products.filter(p => p._id !== id)
                    setProducts(newProducts)
                } else {
                    alert(res.status + ": " + res.data)
                }
            } else { alert("Error deleting") }
        }).finally(() => {
            setIsLoading(false)
            setDeleteModal({ show: false, productId: "" })
        })
    }

    function handleCloseDelete() {
        setDeleteModal({ show: false, productId: "" })
    }


    // SORTING HANDLE
    function handleSearch(list) {

        if (search === "") {
            return list
        }
        return list.filter(p => p.name.toLowerCase().includes(search.toLocaleLowerCase()))
    }
    function handlePriceFilter(list) {
        if (minPrice === "" && maxPrice === "") {
            return list
        }
        const minVal = Number.parseInt(minPrice)
        const maxVal = Number.parseInt(maxPrice)

        if (isNaN(minVal)) {
            return list.filter(p => p.price <= maxVal)
        } else if (isNaN(maxVal)) {
            return list.filter(p => p.price >= minVal)
        } else {
            return list.filter(p => p.price >= minVal && p.price <= maxVal)
        }
    }

    function handleDateFilter(list) {
        if (minDate === "" && maxDate === "") {
            return list
        }
        try {
            const min = new Date(minDate)
            const max = new Date(maxDate)

            return list.filter(p => {
                const date = new Date(p.createdAt)
                if (isNaN(min)) {
                    return date <= max
                }

                if (isNaN(max)) {
                    return date >= min
                }

                return date >= min && date <= max
            })
        } catch (error) {
            return list
        }
    }
    const [currentSort, setCurrentSort] = useState("date")
    function handleSort(list) {
        if (currentSort === "name") {
            const newProducts = list.sort((a, b) => a.name > b.name ? 1 : -1)
            return newProducts
        } else if (currentSort === "price") {
            const newProducts = list.sort((a, b) => a.price < b.price ? -1 : 1)
            return newProducts
        } else if (currentSort === "date") {
            const newProducts = list.sort((a, b) => {
                const date1 = new Date(a.createdAt)
                const date2 = new Date(b.createdAt)
                if (date1 > date2) {
                    return 1
                } else {
                    return -1
                }
            })
            return newProducts
        } else {
            return list
        }
    }


    return (
        <div className='seller-product-container'>
            {isLoading ? <Loader /> : <></>}
            {isVerified ? <></> :
                <div className='text-center my-5'>
                    <h5>You are currently not verified by the Admin</h5>
                    <h6>You may not make changes to your merchandise</h6>
                    <h6>Contact the Admin for more information</h6>
                </div>
            }
            <div className="mx-4">
                <div className="seller-header-bar rounded-4">
                    {isVerified ?
                        <Link className='btn btn-primary me-2' to="/seller/product/addproduct">Add Product</Link> :
                        <></>
                    }
                    <label htmlFor="seller-sort"><b>Sort by:</b></label>
                    <select id="seller sort" className='seller-select-sort' onChange={(e) => {
                        setCurrentSort(e.target.value)
                    }}>
                        <option value="date">Added date</option>
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                    </select>
                    <input type="text" placeholder='search by name' onChange={(e) => setSearch(e.target.value)} className='product-name-search' />
                    <div className='seller-filter'>
                        <p><b>Price:</b></p>
                        <input type="number" placeholder='Min price' onChange={(e => setMinPrice(e.target.value))} />
                        <input type="number" placeholder='Max price' onChange={(e => setMaxPrice(e.target.value))} />
                    </div>
                    <div className='seller-filter'>
                        <p><b>Date:</b></p>
                        <input type="date" placeholder='Min date' onChange={(e => setMinDate(e.target.value))} />
                        <input type="date" placeholder='Max date' onChange={(e => setMaxDate(e.target.value))} />
                    </div>
                    {/*  */}
                </div>

                <div className="container ">
                    {handleSort(handleDateFilter(handlePriceFilter(handleSearch(products))))
                        .map(p => {
                            const createdDate = new Date(p.createdAt)
                            return (
                                <div className="row rounded-3 border my-3 py-2 shadow" key={p._id}>
                                    <div className="col-lg-3">
                                        <img src={`${backendUrl}/image/${p.imgName}`} className="product-img mx-auto d-block img-fluid" alt='product img' />
                                    </div>

                                    <div className="col-lg-6 text-lg-start text-center my-auto">
                                        <h2 ><b>{p.name}</b></h2>
                                        <h4><b>{numberFormat(p.price)} VND</b></h4>
                                        <p className='fs-6 mb-0'>Category: <b>{p.category.name}</b></p>
                                        <p className='fs-6 mb-2'>Added Date: <b>{createdDate.toString()}</b></p>
                                    </div>
                                    <div className="col-lg-3 my-auto px-5">
                                        {isVerified ?
                                            <>
                                                <Link className="btn btn-primary d-block mb-2" to={`/seller/product/edit/${p._id}`}><b>Edit</b></Link>
                                                <button className="btn btn-danger d-block w-100" type="button" onClick={() => setDeleteModal({ show: true, productId: p._id })}><b>Delete</b></button>
                                            </> : <></>
                                        }
                                    </div>
                                </div>
                            )

                        })}
                </div>


                <Modal show={deleteModal.show} onHide={handleCloseDelete} backdrop="static" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Caution</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this product?
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-danger" onClick={() => handleDelete(deleteModal.productId)}>Delete</button>
                        <button className="btn btn-secondary" onClick={() => handleCloseDelete()}>Cancel</button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}