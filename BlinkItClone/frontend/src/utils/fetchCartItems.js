import axiosInstance from "./axios";
import { setCartItems } from "../redux/cartSlice";

const fetchCartItems = async (dispatch) => {
  try {
    const res = await axiosInstance.get("/cart/get-cart-items");
    // console.log("fetchCartItems res", res.data.data);

    if (res.data.success) {
      dispatch(setCartItems(res.data.data));
    }
  } catch (error) {
    console.log("fetch cart items error", error);
  }
};

export default fetchCartItems;
