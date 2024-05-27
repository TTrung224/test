import AuthContextProvider from './Context/LoginSessionContext'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import LoginPage from './Page/LoginPage';
import SignupPage from './Page/SignupPage';
import AdminSellerRequest from './Page/AdminSellerRequest';
import SellerOrder from './Page/SellerOrder';
import SellerProduct from './Page/SellerProduct';
import SellerStatistic from './Page/SellerStatisticPage';
import CustomerProduct from './Page/CustomerProduct';
import CustomerOrder from './Page/CustomerOrder';
import CustomerCart from './Page/CustomerCart';
import Logout from './Component/Shared/Logout';
import AdminCategory from './Page/AdminCategory';
import AdminCategoryForm, { addNewCategory, saveCategory } from './Page/AdminCategoryForm';
import ProductPage from './Page/ProductPage';
import ProductForm, { addProduct, editProduct } from './Component/Seller/ProductForm';
import NotFound from './Component/Shared/NotFound';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <CustomerProduct />
    },
    {
      path: "/product/:productId",
      element: <ProductPage />
    },
    {
      path: "/logout",
      element: <Logout />,
    },
    {
      path: "/cart",
      element: <CustomerCart />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/signup",
      element: <SignupPage />
    },
    {
      path: "/order",
      element: <CustomerOrder />,
    },
    {
      path: "/admin",
      element: <><Navigate to={"seller-request"} /></>
    },
    {
      path: "/admin/seller-request",
      element: <AdminSellerRequest />
    },
    {
      path: "/admin/product-category",
      element: <AdminCategory />
    },
    {
      path: "/admin/product-category/add",
      element: <AdminCategoryForm state="add" />,
      action: addNewCategory
    },
    {
      path: "/admin/product-category/add/:categoryId",
      element: <AdminCategoryForm state="subCategory" />,
      action: addNewCategory
    },
    {
      path: "/admin/product-category/:categoryId",
      element: <AdminCategoryForm state="edit" />,
      action: saveCategory
    },
    {
      path: "/seller",
      element: <Navigate to="/seller/order" replace />,
    },
    {
      path: "/seller/order",
      element: <SellerOrder />,
    },
    {
      path: "/seller/product",
      element: <SellerProduct />
    },
    {
      path: "/seller/statistic",
      element: <SellerStatistic />
    },
    {
      path: "/seller/product/addproduct",
      element: <ProductForm state="add" />,
      action: addProduct
    },
    {
      path: "/seller/product/edit/:productId",
      element: <ProductForm state="edit" />,
      action: editProduct
    },
    {
      path: "*",
      element: <NotFound/>
    }
  ]);


  return (
    <div className="App">
      <AuthContextProvider>
        <RouterProvider router={router}>
        </RouterProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
