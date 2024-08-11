import React, { useEffect } from 'react';
import Home from './pages/Home';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Route
} from "react-router-dom";
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Protected from './features/auth/components/Protected';
import ProductDetailPage from './pages/ProductDetailPage';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItemsByIdAsync } from './features/cart/cartSlice';
import PageNotFound from './pages/404';
import OrderSuccessPage from './pages/OrderSuccessPage';
import UserOrdersPage from './pages/UserOrdersPage';
import UserProfilePage from './pages/UserProfilePage';
import { fetchLoggedInUserAsync, selectUserInfo } from './features/user/userSlice';
import { checkAuthAsync, selectLoggedInUser, selectUserChecked } from './features/auth/authSlice';
import Logout from './features/auth/components/Logout';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminHome from './pages/AdminHome';
import ProtectedAdmin from './features/auth/components/ProtectedAdmin';
import AdminProductDetailPage from './pages/AdminProductDetailPage';
import ProductForm from './features/admin/components/ProductForm';
import AdminProductFormPage from './pages/AdminProductFormPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import StriperCheckout from './pages/StripeCheckout';
import ResetPasswordPage from './pages/ResetPasswordPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Home></Home>
    ),
  },
  {
    path: "/admin",
    element: (
      // TODO fix: redirecting on reload all protected admin pages
      <ProtectedAdmin><AdminHome></AdminHome></ProtectedAdmin>
    ),
  },
  {
    path: "/login",
    element: (
      <LoginPage></LoginPage>
    ),
  },
  {
    path: "/signup",
    element: (
      <SignupPage></SignupPage>
    ),
  },
  {
    path: "/cart",
    element: (
      <Protected><CartPage></CartPage></Protected>
    ),
  },
  {
    //crashing on reload
    path: "/checkout",
    element: (
      <Protected><Checkout></Checkout></Protected>
    ),
  },
  {
    path: "/product_detail/:id",
    element: (
      <Protected><ProductDetailPage></ProductDetailPage></Protected>
    ),
  },
  {
    path: "/admin/product_detail/:id",
    element: (
      <ProtectedAdmin>
        <AdminProductDetailPage></AdminProductDetailPage>
        </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/orders",
    element: (
      <ProtectedAdmin>
        <AdminOrdersPage></AdminOrdersPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/product-form",
    element: (
      <ProtectedAdmin>
        <AdminProductFormPage></AdminProductFormPage>
        </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/product-form/edit/:id",
    element: (
      <ProtectedAdmin>
        <AdminProductFormPage></AdminProductFormPage>
        </ProtectedAdmin>
    ),
  },
  {
    path: "/order-success/:id",
    element: (
      <Protected><OrderSuccessPage></OrderSuccessPage></Protected>
    ),
  },
  {
    path: "/my-orders",
    element: (
      <Protected><UserOrdersPage></UserOrdersPage></Protected>
    ),
  },
  {
    path: "/profile",
    element: (
      <Protected><UserProfilePage></UserProfilePage></Protected>
    ),
  },
  {
    path: "/logout",
    element: (
      <Logout></Logout>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <ForgotPasswordPage></ForgotPasswordPage>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <ResetPasswordPage></ResetPasswordPage>
    ),
  },
  {
    path: "/stripe-checkout",
    element: (
      <Protected>
      <StriperCheckout></StriperCheckout>
      </Protected>
    ),
  },
  {
    path: "*",
    element: (
      <PageNotFound></PageNotFound>
    ),
  },
]);

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const userChecked = useSelector(selectUserChecked);
  useEffect(()=>{
    dispatch(checkAuthAsync());
  },[])
  useEffect(()=>{
    if(user){
      dispatch(fetchItemsByIdAsync());
      // we can get req.user by token of backend so no need to give in front-end
      dispatch(fetchLoggedInUserAsync());
    }
  },[user]);
  return (
    <div className="App">
      {userChecked && <RouterProvider router={router}/>}
    </div>
  );
}

export default App;
