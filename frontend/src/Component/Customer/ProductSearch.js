import React from 'react';
import '../componentStyle.css';

export default function ProductSearchBar(){
    return(
        <div className="search-div">
            <input className="product-search form-control" id="product-search-input" type="text" placeholder="Search" aria-label="default input example"></input>
            <div className="search-icon-div">
                <i className="bi bi-search seach-icon"></i>
            </div>
        </div>
    )
}