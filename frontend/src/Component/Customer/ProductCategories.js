import React from 'react';
import { Link } from 'react-router-dom'
import '../componentStyle.css';

function Category({ category, filters, setFilters }) {
    function chooseCategory(id) {
        if (filters.category && filters.category === id) {
            setFilters({ ...filters, page: 1, category: null, attributes: [], isUpdateAttribute: true })
        } else {
            setFilters({ ...filters, page: 1, category: id, attributes: [], isUpdateAttribute: true })
        }
        return
    }
    if (filters.category && filters.category === category._id) {
        return (
            <div className='category card'>
                <Link onClick={() => chooseCategory(category._id)}>
                    <div className="card active">
                        <p className="category-name">{category.name}</p>
                    </div>
                </Link>
            </div>
        )
    }
    return (
        <div className='category card'>
            <Link onClick={() => chooseCategory(category._id)}>
                <div className="card">
                    <p className="category-name">{category.name}</p>
                </div>
            </Link>
        </div>
    )
}

function CategoryGroup({ categoryList, filters, setFilters }) {
    return (
        <div className='category-group row justify-content-center'>
            {categoryList.map(item => <Category key={item.name} category={item} filters={filters} setFilters={setFilters} />)}
        </div>
    )
}

export default function ProductCategories({ categoryList, filters, setFilters }) {
    let categorySliceList = []
    const numberPerSlice = 7;
    const numberOfSlice = Math.ceil(categoryList.length / numberPerSlice);
    for (let i = 0; i < numberOfSlice; i++) {
        if (i === 0) {
            categorySliceList.push(
                <div className="carousel-item active" key={i}>
                    <CategoryGroup categoryList={categoryList.slice(i * numberPerSlice, (i * numberPerSlice) + (numberPerSlice))} filters={filters} setFilters={setFilters} />
                </div>
            )
        } else {
            categorySliceList.push(
                <div className="carousel-item" key={i}>
                    <CategoryGroup categoryList={categoryList.slice(i * numberPerSlice, (i * numberPerSlice) + (numberPerSlice))} filters={filters} setFilters={setFilters} />
                </div>
            )
        }
    }

    // useEffect(()=>{
    //     categorySliceList = calCategorySliceList()
    // }, [categoryList])


    return (
        <div className='product-categories'>
            <h5>Categories</h5>
            <div id="carouselCategory" className="carousel slide">
                <div className="carousel-inner">
                    {categorySliceList.map(item => { return item })}
                </div>
                <button className="carousel-arrow carousel-control-prev" type="button" data-bs-target="#carouselCategory" data-bs-slide="prev">
                    <i className="bi bi-caret-left-fill"></i>
                </button>
                <button className="carousel-arrow carousel-control-next" type="button" data-bs-target="#carouselCategory" data-bs-slide="next">
                    <i className="bi bi-caret-right-fill"></i>
                </button>
            </div>
        </div>
    )
}