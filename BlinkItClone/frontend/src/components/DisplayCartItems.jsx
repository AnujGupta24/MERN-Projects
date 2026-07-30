import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import { FaCartPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axios";
import fetchCartItems from "../utils/fetchCartItems";
import emptyCart from "../assets/empty_cart.webp";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function DisplayCartItems({ close }) {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  const increaseQty = async (productId) => {
    try {
      const res = await axiosInstance.patch(
        `/cart/increase-quantity/${productId}`,
      );

      if (res.data.success) {
        await fetchCartItems(dispatch);
      }
    } catch (error) {
      console.log("increase qty errror", error);
    }
  };

  const decreaseQty = async (productId) => {
    try {
      const res = await axiosInstance.patch(
        `/cart/decrease-quantity/${productId}`,
      );

      if (res.data.success) {
        await fetchCartItems(dispatch);
      }
    } catch (error) {
      console.log("decrease qty errror", error);
    }
  };

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      navigate("/checkout");
      close();
      return;
    }
    toast.error("please login");
  };

  return (
    <section className="fixed inset-0 z-200 bg-black/50 backdrop-blur-[2px]">
      {/* sidebar */}
      <div className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-[#f7f7f7] shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between border-b bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2 text-green-700">
              <FaCartPlus size={18} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">My Cart</h2>

              <p className="text-sm text-gray-500">{cartItems.length} Items</p>
            </div>
          </div>

          <button
            onClick={close}
            className="cursor-pointer rounded-full p-2 transition hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* delivery card */}
        <div className="border border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center gap-3 rounded-xl bg-green-50 p-3">
            <div className="rounded-full bg-green-600 p-2 text-white">
              <ShoppingBag size={18} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">
                Delivery in 10 minutes
              </h3>

              <p className="text-xs text-gray-500">Shipment of all items</p>
            </div>
          </div>
        </div>

        {/* cart items */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-4">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <img src={emptyCart} className="rounded-xl bg-gray-500" />
              <h2 className="mt-5 text-lg font-semibold text-gray-700">
                Your cart is empty
              </h2>
              <Link
                onClick={close}
                className="mt-4 block rounded bg-green-600 p-3 text-white"
              >
                Shop now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex gap-3">
                    {/* images */}
                    <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-gray-100 bg-white">
                      <img
                        src={item.product.image[0]}
                        alt={item.product.name}
                        className="h-20 w-20 object-contain"
                      />
                    </div>

                    {/* info */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="line-clamp-2 text-sm font-semibold text-gray-800">
                          {item.product.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {item.product.unit} units
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        {/* price */}
                        <p className="text-base font-bold text-gray-900">
                          ₹{item.product.price * item.quantity}
                        </p>

                        {/* quantity */}
                        <div className="flex items-center gap-3 rounded-lg bg-green-600 px-3 py-1.5 text-white">
                          <button
                            onClick={() => decreaseQty(item.product._id)}
                            className="cursor-pointer"
                          >
                            <Minus size={15} />
                          </button>
                          <span className="text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQty(item.product._id)}
                            className="cursor-pointer"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BILL DETAILS */}
        {cartItems.length > 0 && (
          <div className="mx-4 mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="border-b border-gray-100 pb-3 text-lg font-semibold text-gray-800">
              Bill Details
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              {/* total items */}
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Total Items</p>
                <span className="font-medium text-gray-800">
                  {cartItems.length}
                </span>
              </div>

              {/* total quantity */}
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Total Quantity</p>
                <span className="font-medium text-gray-800">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>

              {/* divider */}
              <div className="border-t border-dashed border-gray-200 pt-3" />

              {/* grand total */}
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-gray-800">
                  Grand Total
                </p>
                <span className="text-lg font-bold text-gray-900">
                  ₹{totalPrice}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* footer */}
        {cartItems.length > 0 && (
          <div className="border-t bg-white p-4">
            <div className="rounded-2xl bg-green-600 p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-100">Total Amount</p>
                  <h2 className="text-2xl font-bold">₹{totalPrice}</h2>
                </div>
                <button
                  onClick={redirectToCheckoutPage}
                  className="rounded-xl bg-white px-5 py-3 font-semibold text-green-700 transition hover:bg-green-50"
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default DisplayCartItems;
