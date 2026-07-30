import { Link } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import fetchCartItems from "../utils/fetchCartItems";

function CategoryCard({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartItem = cartItems.find((item) => item.product._id === product._id);
  const quantity = cartItem?.quantity || 0;

  const [loading, setLoading] = useState(false);

  const slugify = (text = "") => {
    return text
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/,/g, "")
      .replace(/\s+/g, "-");
  };

  const addToCartHandler = async (productId, e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axiosInstance.post(`/cart/add-to-cart/${productId}`);
      // console.log("add to cart res", res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        await fetchCartItems(dispatch);
      }
    } catch (error) {
      console.log("add to cart error", error);
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axiosInstance.patch(
        `/cart/increase-quantity/${product._id}`,
      );
      // console.log("increase", res.data.data);

      if (res.data.success) {
        await fetchCartItems(dispatch);
      }
    } catch (error) {
      console.log("increase quantity error", error);
    } finally {
      setLoading(false);
    }
  };

  const decreaseQty = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axiosInstance.patch(
        `/cart/decrease-quantity/${product._id}`,
      );
      // console.log("decrease", res.data.data);

      if (res.data.success) {
        await fetchCartItems(dispatch);
      }
    } catch (error) {
      console.log("decrease quantity error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      to={`/product/${slugify(product?.name)}-${product?._id}`}
      className="flex min-w-62.5 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      {/* Product Image */}
      <div className="h-40 overflow-hidden rounded-xl bg-gray-100">
        <img
          src={product.image[0]}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
      </div>

      {/* Product Name */}
      <h3 className="text-md mt-3 line-clamp-2 min-h-12 font-medium text-gray-700">
        {product.name}
      </h3>

      {/* Product Unit */}
      <p className="text-md mt-1 min-h-6 text-gray-500">{product.unit} units</p>

      {/* Price + Discount */}
      <div className="mt-2 flex min-h-8 items-center gap-2">
        <p className="text-lg font-bold text-green-700">₹{product.price}</p>

        {product.originalPrice && (
          <p className="text-md text-gray-400 line-through">
            ₹{product.originalPrice}
          </p>
        )}

        {product.discount ? (
          <span className="min-w-16 rounded-full bg-green-100 px-2 py-1 text-sm font-medium text-green-700">
            {product.discount}% OFF
          </span>
        ) : (
          ""
        )}
      </div>

      {/* Add Button / Quantity Buttons */}
      <div className="mt-auto flex justify-end pt-4">
        {quantity === 0 ? (
          <button
            disabled={loading}
            onClick={(e) => addToCartHandler(product._id, e)}
            className="text-md w-25 rounded-lg border border-green-600 bg-green-50 py-2 font-semibold text-green-700 transition hover:bg-green-100"
          >
            {loading ? "..." : "ADD"}
          </button>
        ) : (
          <div className="flex w-25 items-center justify-between rounded-lg border border-green-600 px-3 py-2">
            <button
              disabled={loading}
              onClick={decreaseQty}
              className="text-green-700 transition hover:scale-110"
            >
              <Minus size={18} />
            </button>
            <span className="text-md font-semibold text-gray-700">
              {quantity}
            </span>
            <button
              disabled={loading}
              onClick={increaseQty}
              className="text-green-700 transition hover:scale-110"
            >
              <Plus size={18} />
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}

export default CategoryCard;
