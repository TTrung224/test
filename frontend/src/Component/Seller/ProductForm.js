import { Form, redirect, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Shared/Navbar';
import { useContext, useEffect, useRef, useState } from 'react';
import { getCategories } from '../../Service/CategoryAPI';
import Loader from '../Shared/Loader';
import { createProduct, getProduct, saveProduct } from '../../Service/ProductAPI';
import { AuthContext } from '../../Context/LoginSessionContext';

async function loadCategories() {
    try {
        const result = await getCategories()
        return result.data
    } catch {
        alert("Error loading categories")
        return []
    }
}

export async function addProduct({ request }) {
    const formData = await request.formData()
    await createProduct(formData)
    return redirect("/seller/product")
}

export async function editProduct({ params, request }) {
    const formData = await request.formData()
    await saveProduct(params.productId, formData)
    return redirect("/seller/product")
}

async function loadProduct(productId) {
    const product = await getProduct(productId)
    return product.data
}



export default function ProductForm({ state }) {
    const { authState: { user } } = useContext(AuthContext)
    const navigate = useNavigate()
    const { productId } = useParams()
    const isEdit = state === "edit"

    const [isLoading, setIsLoading] = useState(true)

    const [categories, setCategories] = useState([])
    const [attributes, setAttributes] = useState([])
    let pName = useRef("")
    let pPrice = useRef("")
    let pDesc = useRef("")

    useEffect(() => {

        if (isEdit) {
            loadProduct(productId).then(p => {
                if (p === null) {
                    alert("Unable to get product")
                    navigate(-1)
                } else {
                    pName.current = p.name
                    pPrice.current = p.price
                    pDesc.current = p.description
                    setCategories(p.category)
                    setAttributes(p.attributes)
                }
            }).finally(() => {
                setIsLoading(false)
            })
        } else {
            loadCategories().then(res => {
                setCategories(res)

            }).finally(() => {
                setIsLoading(false)
            })
        }
    }, [isEdit, navigate, productId])


    function handleInput(e) {
        // To get attributes from chosen category
        const newAttributes = getAttributes(e.target.value)
        const newAttributeValues = []
        newAttributes.forEach(a => {
            newAttributeValues.push({ attribute: a, value: "" })
        })

        setAttributes(newAttributeValues)
    }

    function handleEditAttributes(e, entry) {
        const value = e.target.value
        const newAttributes = attributes.map(a => {
            if (a.attribute.name === entry.attribute.name) {
                return { attribute: a.attribute, value: value }
            } else {
                return a
            }
        })
        setAttributes(newAttributes)
    }

    function getAttributes(categoryId) {
        if (categoryId === "") { return [] }

        let attributeFields = []
        while (categoryId !== null) {
            const currentId = categoryId
            const cate = categories.find(c => c._id === currentId)
            attributeFields = attributeFields.concat(cate.attributes)
            categoryId = cate.parentCategoryId
        }
        return attributeFields.reverse()
    }


    return (
        <>
            <Navbar />
            {isLoading ? <Loader /> : <></>}
            <div className="container rounded border shadow p-5 my-5">
                <Form method='POST' encType='multipart/form-data'>

                    <h2>Product Form</h2>

                    <div className="form-group mb-3">
                        <label htmlFor="productImg">Product Image</label>
                        <input className='form-control' type='file' name='productImg' id='productImg'  required={!isEdit} />
                    </div>


                    <div className="form-group mb-3">
                        <label htmlFor="productName">Product Name</label>
                        <input className='form-control' type='text' name='productName' id="productName" placeholder='Name of Product' defaultValue={pName.current} required />
                    </div>


                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="productPrice">Product Price</label>
                            <div className="input-group">
                                <input className='form-control' min={500} type='number' name='productPrice' id="productPrice" placeholder='Price of Product' defaultValue={pPrice.current} required />
                                <span className="input-group-text">VND</span>
                            </div>

                        </div>
                        {isEdit ?
                            <></> :
                            <div className="col">
                                <label htmlFor="productCat">Product Category</label>
                                <select className='form-control' name="productCategory" placeholder='add product category' onChange={event => handleInput(event)} required>
                                    <option value="" disabled>Select a category for your product</option>
                                    {categories.map(category => {
                                        return (
                                            <option key={category._id} value={category._id}>{category.name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        }
                    </div>
                    <input type="hidden" name="productAttributes" value={JSON.stringify(attributes)} />
                    <input type="hidden" name="productSeller" value={user?._id} />
                    {isEdit ?
                        <p className='mb-3'>Product Category: <b>{categories.name}</b></p> :
                        <></>
                    }

                    <div className="form-group mb-3">
                        <p className='mb-1'>Product Attributes</p>
                        {attributes.map((entry, index) => {
                            const a = entry.attribute
                            const val = entry.value
                            return (
                                <div className="row container align-items-center mb-2">
                                    <div key={index} className="col-auto">
                                        <label htmlFor={a.name}>{a.name} {a.required ? "(Required)" : "(Optional)"}</label>
                                    </div>
                                    <div className="col-auto">
                                        <input className='form-control' type={a.type} id={a.name} required={a.required} defaultValue={val} onChange={(e) => { handleEditAttributes(e, entry) }} />
                                    </div>

                                </div>
                            )
                        })}
                    </div>


                    <div className="mb-3">
                        <label htmlFor="add-product-des">Product Description</label>
                        <textarea className='form-control' name="productDesc" id="productDesc" cols="30" rows="10" minLength={50} maxLength={1000} defaultValue={pDesc.current} required />
                    </div>


                    <button type="submit" className='btn btn-primary btn-lg me-3'>Submit</button>
                    <button type="button" className="btn btn-secondary btn-lg" onClick={() => { navigate(-1) }}>Cancel</button>

                </Form>

            </div>
        </>

    )
}