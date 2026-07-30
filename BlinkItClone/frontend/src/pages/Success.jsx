import { CheckCircle2, ShoppingBag, Truck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Success = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg my-6 rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-800">
          Order Placed Successfully
        </h1>

        <p className="mt-3 text-gray-500">
          Your order has been confirmed and is being prepared. You will receive
          updates shortly.
        </p>

        <div className="mt-6 rounded-xl bg-gray-100 p-4">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="text-lg font-semibold text-gray-800">{orderId}</p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 text-gray-600">
          <Truck size={20} />
          <span>Estimated delivery in 10-15 minutes</span>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/dashboard/orders"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-medium text-white transition hover:bg-green-700"
          >
            <Truck size={18} />
            Track Order
          </Link>

          <Link
            to="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 font-medium transition hover:bg-gray-100"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
