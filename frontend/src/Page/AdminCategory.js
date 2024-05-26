import AdminCategoryList from '../Component/Admin/AdminCategoryList';
import { Link } from 'react-router-dom';
import { deleteCategory, getCategories } from '../Service/CategoryAPI';
import Navbar from '../Component/Shared/Navbar';
import React, { useEffect, useState } from 'react';
import Loader from '../Component/Shared/Loader';


export async function loadCategories() {
    try{
        const categories = await getCategories()
        return categories.data
    }catch(err){
        alert("Error loading categories")
        return[]
    }
}

const AdminCategory = () => {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadCategories().then(c =>
            setCategories(c)
        ).finally(() => { setIsLoading(false) })
    }, [])


    async function handleDeleteCategory(id) {
        setIsLoading(true)
        try {
            // const newCategories = categories.filter(c => c._id !== id)
            await deleteCategory(id)
            // setCategories(newCategories)
            loadCategories().then(c =>
                setCategories(c)
            )
        } catch (err) {
            console.log(err)
            alert(err.message)
        } finally { setIsLoading(false) }
    }

    return (
        <>
            <Navbar />
            {isLoading ? <Loader /> : <></>}
            <div className="container">
                <h2>Category</h2>
                <hr />
                <Link to={"add"}><button className="btn btn-primary mt-4">Add Category</button></Link>
                <AdminCategoryList categories={categories} parent={null} handleDeleteCategory={handleDeleteCategory} />
            </div>
        </>

    );
}

export default AdminCategory;