import { useDispatch, useSelector } from "react-redux";
import {
  BanknoteArrowUp,
  CreditCard,
  MapPin,
  ReceiptIndianRupee,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";
import { clearCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

function CheckOutPage() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const addresses = useSelector((state) => state.address.addressList);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  const deliveryFee = totalPrice > 500 ? 0 : 40;
  const grandTotal = totalPrice + deliveryFee;

  const handleCashOnDelivery = async (data) => {
    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }

    data = {
      productItems: cartItems,
      subTotalAmount: totalPrice,
      totalAmount: grandTotal,
      deliveryAddress: selectedAddress._id,
    };

    try {
      const res = await axiosInstance.post("/order/cash-on-delivery", data);
      // console.log("COD payment res", res.data.data);

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(clearCart());
        navigate("/success", {
          state: {
            orderId: res.data.data[0]?.orderId,
          },
        });
      }
    } catch (error) {
      console.log("COD payment error", error);
    }
  };

  const openRazorpay = (order, orderData) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: "Blinkit Clone",
      description: "Order Payment",
      order_id: order.id,

      handler: async function (response) {
        try {
          const verifyRes = await axiosInstance.post("/order/verify-payment", {
            ...response,
            ...orderData,
          });

          // console.log("verifyRes ", verifyRes);
          if (verifyRes.data.success) {
            toast.success("Payment Successful");
            dispatch(clearCart());
            navigate("/success", {
              state: {
                orderId: verifyRes.data.data[0]?.orderId,
              },
            });
          }
        } catch (error) {
          toast.error("Payment verification failed");
          console.log("openrazorpay error", error);
        }
      },

      theme: {
        color: "#22c55e",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  const handlePayOnline = async (data) => {
    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }

    data = {
      productItems: cartItems,
      subTotalAmount: totalPrice,
      totalAmount: grandTotal,
      deliveryAddress: selectedAddress._id,
    };

    try {
      const res = await axiosInstance.post("/order/pay-online", data);
      console.log("Online payment res", res);

      const razorpayorder = res.data.data;
      openRazorpay(razorpayorder, data);
    } catch (error) {
      console.log("Online payment error", error);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* DELIVERY ADDRESS */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-2 text-green-700">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Delivery Address
                    </h2>

                    <p className="text-sm text-gray-500">
                      Select delivery location
                    </p>
                  </div>
                </div>
              </div>

              {/* ADDRESS LIST */}
              <div className="mt-5 space-y-4">
                {addresses.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
                    <p className="text-sm text-gray-500">
                      No address added yet
                    </p>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div
                      key={address._id}
                      onClick={() => {
                        setSelectedAddress(address);
                      }}
                      className={`cursor-pointer rounded-xl border p-4 transition ${
                        selectedAddress === address
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200"
                      } flex items-center justify-between`}
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {address.addressLine}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          {address.city}, {address.state}
                        </p>

                        <p className="text-sm text-gray-600">
                          {address.country} - {address.pincode}
                        </p>

                        <p className="mt-1 text-sm text-gray-700">
                          Mobile: {address.mobile}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* CART ITEMS  Section */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2 text-green-700">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Order Summary
                  </h2>
                  <p className="text-sm text-gray-500">
                    Total items in cart: {cartItems.length}
                  </p>
                </div>
              </div>

              {/* cartItems  */}
              <div className="mt-5 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 border-b border-gray-100 pb-4"
                  >
                    <img
                      src={item.product.image[0]}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {item.product.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {item.product.unit} kg/units
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>

                      <p className="mt-2 font-semibold text-gray-900">
                        ₹{item.product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <>
            <div className="sticky top-20 rounded-2xl bg-white p-5 shadow-sm">
              {/* TITLE */}
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2 text-green-700">
                  <CreditCard size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Payment Details
                  </h2>

                  <p className="text-sm text-gray-500">Complete your order</p>
                </div>
              </div>

              {/* BILL */}
              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Items</span>

                  <span className="font-medium text-gray-800">
                    {cartItems.length}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Quantity</span>

                  <span className="font-medium text-gray-800">
                    {totalQuantity}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Item Total</span>

                  <span className="font-medium text-gray-800">
                    ₹{totalPrice}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>

                  <span className="font-medium text-gray-800">
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-800">
                      Grand Total
                    </span>

                    <span className="text-2xl font-bold text-gray-900">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>

                <h3 className="mb-3 font-semibold text-gray-800">
                  Payment Method:
                </h3>

                {/* PAYMENT BUTTON */}
                <button
                  onClick={handleCashOnDelivery}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  <ReceiptIndianRupee size={20} />
                  Cash On Delivery
                </button>

                <button
                  onClick={handlePayOnline}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  <BanknoteArrowUp size={20} />
                  Pay Online
                </button>

                <p className="text-center text-xs text-gray-400">
                  Safe & Secure Payments
                </p>
              </div>
            </div>
          </>
        </div>
      </div>
    </section>
  );
}

export default CheckOutPage;
