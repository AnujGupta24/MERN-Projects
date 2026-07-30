import { ReceiptIndianRupee, CalendarDays } from "lucide-react";
import { useSelector } from "react-redux";
import NoData from "../components/NoData";

function MyOrders() {
  const orders = useSelector((state) => state.order.orders);

  return (
    <>
      {/* header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
        <p className="text-sm text-gray-500">Manage all your orders here</p>
      </div>

      {orders.length === 0 ? (
        <>
          <NoData />
          <p className="mt-1 text-sm text-center text-gray-500">
            You haven't placed any orders yet.
          </p>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {orders.map((order) => {
            return (
              <div
                key={order._id}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 md:flex-row">
                  {/* image */}
                  <img
                    src={order?.productDetails.image[0]}
                    alt={order?.productDetails?.name}
                    className="h-28 w-28 rounded-xl object-cover"
                  />

                  {/* details */}
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-800">
                      {order?.productDetails?.name}
                    </h2>
                    <div className="mt-3 space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Order ID:</span>{" "}
                        {order.orderId}
                      </p>

                      <p className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>

                      <p className="flex items-center gap-2">
                        <ReceiptIndianRupee size={16} />₹{order.totalAmount}
                      </p>
                    </div>
                    <div className="mt-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.paymentStatus === "PAID"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p className="font-semibold">Delivery Address:</p>
                      <p>{order.deliveryAddress?.addressLine}</p>
                      <p>
                        {order.deliveryAddress?.city},{" "}
                        {order.deliveryAddress?.state}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default MyOrders;
