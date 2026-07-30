import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { useEffect } from "react";
import fetchUserDetails from "./utils/fetchUserDetails";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/userSlice";
import {
  setAllCategory,
  setLoadingCategory,
  setSubCategory,
} from "./redux/productSlice";
import axiosInstance from "./utils/axios";
import fetchCartItems from "./utils/fetchCartItems";
import { setAddress } from "./redux/addressSlice";
import { setOrders } from "./redux/orderSlice";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const getUser = async () => {
    const userData = await fetchUserDetails();

    if (userData?.success) {
      dispatch(setUser(userData.data));
    }
  };

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));

      const res = await axiosInstance.get("/category/all-categories");

      if (res.data.success) {
        dispatch(setAllCategory(res.data.data));
      }
    } catch (error) {
      console.log("fetchCategory error", error);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  const fetchSubCategory = async () => {
    try {
      const res = await axiosInstance.get("/subcategory/all-subcategories");

      if (res.data.success) {
        dispatch(setSubCategory(res.data.data));
      }
    } catch (error) {
      console.log("fetchSubCategory error", error);
    }
  };

  const fetchUserAddress = async () => {
    try {
      const res = await axiosInstance.get("/address/get-user-addresses");

      if (res.data.success) {
        dispatch(setAddress(res.data.data));
      }
    } catch (error) {
      console.log("fetchSubCategory error", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/order/my-orders");
      // console.log("my orders res", res.data.data);

      if (res.data.success) {
        dispatch(setOrders(res.data.data));
      }
    } catch (error) {
      console.log("FETCH ORDERS ERROR ", error);
    }
  };

  useEffect(() => {
    getUser();
    fetchCategory();
    fetchSubCategory();
    fetchUserAddress();
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    const loadCart = async () => {
      if (user?._id) {
        await fetchCartItems(dispatch);
      }
    };
    loadCart();
  }, [dispatch, user]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="grow bg-blue-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
export default App;
