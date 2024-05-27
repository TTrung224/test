import { useState } from 'react'
import AdminCategoryList from "./AdminCategoryList";
import { Link } from 'react-router-dom';

const AdminCategoryItem = ({ categories, item, handleDeleteCategory }) => {
    const [collapsed, setCollapsed] = useState(true)
    let collapseElement = <></>
    let collapseIndicator = <i className='bi-chevron-compact-right' />
    if (!collapsed) {
        collapseElement =
            <div className='ms-3'>
                <AdminCategoryList categories={categories} parent={item._id} handleDeleteCategory={handleDeleteCategory} />
            </div>
        collapseIndicator = <i className='bi-chevron-compact-down' />
    } else {
        collapseElement = <></>
        collapseIndicator = <i className='bi-chevron-compact-right' />
    }


    return (
        <>
            <div className="row align-items-center">
                <div className="col-6">
                    <button type='button' className='btn w-100 text-start' onClick={() => collapsed ? setCollapsed(false) : setCollapsed(true)}>
                        <span className='me-2'>{collapseIndicator}</span>{item.name}
                    </button>
                </div>
                <div className="col-6 text-end">
                    <Link to={`add/${item._id}`}>
                        <button type='button' className="btn btn-link btn-sm">
                            +Subcategory
                        </button>
                    </Link>

                    <Link to={`${item._id}`}>
                        <button type='button' className="btn">
                            <i className="bi-pencil-square"></i>
                        </button>
                    </Link>

                    {
                        item.updatable?
                            <button type='button' className="btn" onClick={() => handleDeleteCategory(item._id)}>
                                <i className="bi-trash"></i>
                            </button>
                        :
                            <button type='button' className="btn border-0" disabled>
                                <i className="bi-trash"></i>
                            </button>
                    }
                </div>
            </div>
            {collapseElement}
        </>
    );
}

export default AdminCategoryItem;