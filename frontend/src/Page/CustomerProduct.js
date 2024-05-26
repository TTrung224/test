import React, { useEffect, useState } from 'react';
import ProductCategories from '../Component/Customer/ProductCategories';
import ProductFilter from '../Component/Customer/ProductFilter';
import ProductList from '../Component/Customer/ProductList';
import ProductSearchBar from '../Component/Customer/ProductSearch';
import Navbar from '../Component/Shared/Navbar';
import './pageStyle.css';
import { getAllProducts } from '../Service/ProductAPI'
import Loader from '../Component/Shared/Loader';
import { getCategories } from '../Service/CategoryAPI';


async function loadProducts(filters) {
    const res = await getAllProducts(filters)
    return res
}

// function resetAttributeList(filterAttributes, existedAttributes){
//     filterAttributes = filterAttributes.filter(item => existedAttributes.includes(item))
//     return filterAttributes
// }


export default function CustomerProduct() {
    const [isLoading, setIsLoading] = useState(true)
    const [maxItem, setMaxItem] = useState(0)
    const [productList, setProductList] = useState([])
    const [categoryList, setCategoryList] = useState([])

    // const [page, setPage] = useState(1)
    const [filters, setFilters] = useState({page: 1, maxPerPage: 12, search: "", minPrice: "", maxPrice: "", minDate: "", maxDate: "", attributes: [], category: null, isUpdateAttribute: false})
    const [attributeFilterList, setAtributeFilterList] = useState({})

    useEffect(() => {
        setIsLoading(true)
        loadProducts(filters).then((res) => {
            if (res) {
                if (res.status === 200) {
                    setProductList(res.data?.products)
                    setMaxItem(res.data?.count)
                    console.log(filters.isUpdateAttribute)
                    if(filters.isUpdateAttribute){
                        setAtributeFilterList(res.data?.attributes)
                    }
                }
            }
        }).finally(() => { setIsLoading(false) })

        //Event timeout event listener for filtering text input
        const searchInput = document.getElementById("product-search-input");
        const minPriceInput = document.getElementById("min-price-input");
        const maxPriceInput = document.getElementById("max-price-input");

        let timeout1 = null;
        const handleSearchChange = (event) => {
            clearTimeout(timeout1);

            timeout1 = setTimeout(async function(){
                // resetAttributeList(filters.attributes, )
                setFilters({...filters, page: 1, search: searchInput.value, attributes: [], isUpdateAttribute: true})
            }, 300);
        }
        searchInput.addEventListener("keyup", handleSearchChange)

        let timeout2 = null;
        const handleMinPriceChange = (event) => {
            clearTimeout(timeout2);

            timeout2 = setTimeout(async function(){
                setFilters({...filters, page: 1, minPrice: minPriceInput.value, isUpdateAttribute: false})
            }, 300);
        }
        minPriceInput.addEventListener("keyup", handleMinPriceChange)
        
        let timeout3 = null;
        const handleMaxPriceChange = (event) => {
            clearTimeout(timeout3);

            timeout3 = setTimeout(async function(){
                setFilters({...filters, page: 1, maxPrice: maxPriceInput.value, isUpdateAttribute: false})
            }, 300);
        }
        maxPriceInput.addEventListener("keyup", handleMaxPriceChange)


        return () => {
            searchInput.removeEventListener('keyup', handleSearchChange);
            minPriceInput.removeEventListener('keyup', handleMinPriceChange);
            maxPriceInput.removeEventListener('keyup', handleMaxPriceChange);
        };
    }, [filters])

    useEffect(() => {
        setIsLoading(true)
        getCategories().then((res) => {
            if (res) {
                if (res.status === 200) {
                    setCategoryList(res.data)
                }
            }
        }).finally(() => { setIsLoading(false) })
    }, [])

    return (
        <>
            <Navbar />
            {isLoading ? <Loader /> : <></>}
            <div className='product-all-container'>
                <ProductSearchBar/>
                <ProductCategories filters={filters} setFilters={setFilters} categoryList={categoryList}/>
                <div className='product-mega'>
                    <ProductFilter filters={filters} setFilters={setFilters} attributeList={attributeFilterList}/>
                    <ProductList productList={productList} maxItem={maxItem} filters={filters} setFilters={setFilters}/>
                </div>
            </div>
        </>
    )
}
