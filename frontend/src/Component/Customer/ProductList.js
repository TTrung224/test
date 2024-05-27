import React from 'react';
import { Link } from 'react-router-dom';
import '../componentStyle.css';
import PaginationList from '../Shared/Pagination';
import { backendUrl, numberFormat } from '../../Context/constants';

function ProductCard({ product }) {
    return (
        <Link to={`/product/${product._id}`}>
            <div className="card">
                <div className='image-holder'>
                    <img src={backendUrl + `/image/${product.imgName}`} className='card-img-top' alt="product " />
                </div>
                <div className="card-body">
                    <h5 className="product-name">{product.name}</h5>
                    <p className="card-text price">{numberFormat(product.price)} VND</p>
                    <p className="card-text"><b>{product.category.name}</b></p>
                </div>
            </div>
        </Link>
    )
}


export default function ProductList({ productList, maxItem, filters, setFilters }) {
    return (
        <div className='product-list'>
            <div className='card-holder row justify-content-center'>
                {productList.map(product => <ProductCard key={product._id} product={product} />)}
            </div>

            <PaginationList totalItems={maxItem}  filters={filters} setFilters={setFilters} />
        </div>
    )
}