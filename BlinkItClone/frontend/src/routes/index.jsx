import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import SearchPage from "../pages/SearchPage.jsx";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import VerifyEmail from "../pages/VerifyEmail.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import VerifyOtp from "../pages/VerifyOtp.jsx";
import Dashboard from "../layouts/Dashboard.jsx";
import Profile from "../pages/Profile.jsx";
import MyOrders from "../pages/MyOrders.jsx";
import Address from "../pages/Address.jsx";
import EditProfile from "../pages/EditProfile.jsx";
import Category from "../pages/Category.jsx";
import SubCategory from "../pages/SubCategory.jsx";
import UploadProduct from "../pages/UploadProduct.jsx";
import AdminRoute from "../components/AdminRoute.jsx";
import ProductAdmin from "../pages/ProductAdmin.jsx";
import ProductListPage from "../pages/ProductListPage.jsx";
import ProductDetailsPage from "../pages/ProductDetailsPage.jsx";
import CheckOutPage from "../pages/CheckOutPage.jsx";
import Success from "../pages/Success.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "edit-profile",
            element: <EditProfile />,
          },
          {
            path: "orders",
            element: <MyOrders />,
          },
          {
            path: "address",
            element: <Address />,
          },
          {
            path: "category",
            element: (
              <AdminRoute>
                <Category />
              </AdminRoute>
            ),
          },
          {
            path: "sub-category",
            element: (
              <AdminRoute>
                <SubCategory />
              </AdminRoute>
            ),
          },
          {
            path: "upload-product",
            element: (
              <AdminRoute>
                <UploadProduct />
              </AdminRoute>
            ),
          },
          {
            path: "products",
            element: (
              <AdminRoute>
                <ProductAdmin />
              </AdminRoute>
            ),
          },
        ],
      },
      {
        path: ":category",
        children: [
          {
            path: ":subcategory",
            element: <ProductListPage />,
          },
        ],
      },
      {
        path: "product/:product",
        element: <ProductDetailsPage />,
      },
      {
        path: "checkout",
        element: <CheckOutPage />,
      },
      {
        path: "success",
        element: <Success />,
      },
    ],
  },
]);

export default router;
