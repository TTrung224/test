import React from 'react';
import '../componentStyle.css';

function AtributeFilter({atribute, attributeName, onCheck, selectedValues}){
    return(
        <div className='attribute-filters'>
            <h5>{attributeName}</h5>
            <div className='attribute-filter'>
                {atribute.map(item => {
                    return (
                    <div key={item}>
                        <input className="attibute-checkbox" type="checkbox" onClick={()=>onCheck(attributeName, item)} defaultChecked={selectedValues.includes(item)}></input>
                        <label>{item}</label><br />
                    </div>
                    )
                })}
            </div>
            <hr />
        </div> 
    )
}

export default function ProductFilter({filters, setFilters, attributeList}){
    const attributeNameList = Object.keys(attributeList)

    function onCheck(attributeName, value){
        if(filters.attributes.includes(value)){
            const attributes = filters.attributes.filter(each => each !== value)
            setFilters({...filters, attributes: attributes, isUpdateAttribute: false})
        }else{            
            const attributes = [...filters.attributes, value]
            setFilters({...filters, attributes: attributes, isUpdateAttribute: false})
        }
    }

    return(
        <div className='product-filters'>
            <h5>Price</h5>
            <div className='price-filter'>
                <input type="number" className="form-control" id="min-price-input" placeholder="Min" min="0"></input>
                <nav> - </nav>
                <input type="number" className="form-control" id="max-price-input" placeholder="Max" min="0"></input>
                <i className="bi bi-funnel-fill price-filter-icon"></i>
            </div>
            <hr />
            <h5>Date Added</h5>
            <div className='price-filter'>
                <input type="date" className="form-control" id="min-date-input" placeholder="Min" 
                    onChange={(e)=>setFilters({...filters, page: 1, minDate: e.target.value, isUpdateAttribute: false})}>
                </input>
                <nav> - </nav>
                <input type="date" className="form-control" id="max-date-input" placeholder="Max" 
                    onChange={(e)=>setFilters({...filters, page: 1, maxDate: e.target.value, isUpdateAttribute: false})}>
                </input>
                <i className="bi bi-funnel-fill price-filter-icon"></i>
            </div>
            <hr />
            {attributeNameList.map(attributeName => {
                return <AtributeFilter key={attributeName} atribute={attributeList[attributeName]} attributeName={attributeName} onCheck={onCheck} selectedValues={filters.attributes}/>
            })}
        </div>
    )
}