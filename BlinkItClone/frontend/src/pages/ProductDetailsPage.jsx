/* eslint-disable react-hooks/set-state-in-effect */
import { Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { useEffect, useState } from "react";
import { BadgePercent, ShieldCheck, ShoppingCart, Star } from "lucide-react";
import bestPriceAndOfferImage from "../assets/Best_Prices_Offers.png";
import minuteDeliveryImage from "../assets/minute_delivery.png";
import wideAssortmentImage from "../assets/Wide_Assortment.png";
import ProductDetailsSkeleton from "../components/ProductDetailsSkeleton";
import fetchCartItems from "../utils/fetchCartItems";

const ProductDetailsPage = () => {
  const params = useParams();
  const productId = params.product.split("-").pop();

  const [product, setProduct] = useState({});
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const cartItem = cartItems.find((item) => item.product._id === product._id);
  const quantity = cartItem?.quantity || 0;

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        `/product/get-product-details/${productId}`,
      );
      // console.log("PRODUCT DETAILS RES", res.data);
      setProduct(res?.data?.data);

      if (res?.data?.data?.image?.length > 0) {
        setActiveImage(res?.data?.data?.image[0]);
      }
    } catch (error) {
      console.log("PRODUCT DETAILS ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const discountedPrice = Math.round(
    product.price - (product.price * product.discount) / 100,
  );

  const addToCartHandler = async () => {
    try {
      const res = await axiosInstance.post(`/cart/add-to-cart/${product._id}`);

      if (res.data.success) {
        toast.success(res.data.message);
        await fetchCartItems(dispatch);
      }
    } catch (error) {
      console.log("add to cart error", error);
    }
  };

  const increaseQty = async () => {
    try {
      const res = await axiosInstance.patch(
        `/cart/increase-quantity/${product._id}`,
      );

      if (res.data.success) {
        await fetchCartItems(dispatch);
      }
    } catch (error) {
      console.log("increase qty error", error);
    }
  };

  const decreaseQty = async () => {
    try {
      const res = await axiosInstance.patch(
        `/cart/decrease-quantity/${product._id}`,
      );

      if (res.data.success) {
        await fetchCartItems(dispatch);
      }
    } catch (error) {
      console.log("decrease qty error", error);
    }
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  return (
    <section className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            {/* main image */}
            <div className="flex h-105 items-center justify-center overflow-hidden rounded-xl border bg-white">
              <img
                src={activeImage}
                alt={product?.name}
                className="h-full w-full object-contain"
              />
            </div>

            {/* image list */}
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {product?.image?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`cursor-pointer overflow-hidden rounded-lg border-2 bg-white transition-all ${
                    activeImage === img ? "border-green-600" : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt="product"
                    className="h-24 w-24 object-contain p-2"
                  />
                </button>
              ))}
            </div>

            <div className="mt-5">
              <h3 className="text-md font-bold">Product Description:</h3>
              <p className="mt-2 text-base text-gray-500">
                {product?.description}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5">
            {/* delivery */}
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              <ShieldCheck size={18} />
              10 Minute Delivery
            </div>

            {/* title */}
            <h1 className="text-3xl font-bold text-gray-800">
              {product?.name}
            </h1>

            {/* rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-sm font-semibold text-white">
                <Star size={14} fill="yellow" />
                4.5
              </div>

              <span className="text-sm text-gray-500">
                2,341 Ratings & Reviews
              </span>
            </div>

            <div className="grid gap-5 min-[620px]:grid-cols-2 min-[770px]:grid-cols-2">
              {/* Price card */}
              <div className="flex h-full flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm">
                <div>
                  {/* price */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{discountedPrice}
                    </span>

                    <span className="text-lg text-gray-400 line-through">
                      ₹{product?.price}
                    </span>

                    <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      <BadgePercent size={16} />
                      {product?.discount}% OFF
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    Inclusive of all taxes
                  </p>

                  {/* unit + stock */}
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <div className="rounded-lg border px-4 py-2.5 text-sm font-semibold">
                      {product?.unit} KG
                    </div>

                    <div
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${
                        product?.stock > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product?.stock > 0
                        ? `${product?.stock} In Stock`
                        : "Out Of Stock"}
                    </div>
                  </div>
                </div>

                {/* BUTTON */}
                {quantity === 0 ? (
                  <button
                    onClick={addToCartHandler}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white transition-all hover:bg-green-700"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-green-600 px-5 py-3">
                    <button
                      onClick={decreaseQty}
                      className="cursor-pointer text-green-700"
                    >
                      <Minus size={20} />
                    </button>

                    <span className="text-lg font-semibold">{quantity}</span>

                    <button
                      onClick={increaseQty}
                      className="cursor-pointer text-green-700"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* PRODUCT INFO */}
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-xl font-bold text-gray-800">
                  Product Details
                </h2>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start justify-between gap-4 border-b pb-3">
                    <span className="shrink-0 text-gray-500">Product Name</span>

                    <span className="text-right font-medium text-gray-800">
                      {product?.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="text-gray-500">Category</span>

                    <span className="text-right font-medium text-gray-800">
                      {product?.subCategory?.[0]?.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="text-gray-500">Unit</span>

                    <span className="font-medium text-gray-800">
                      {product?.unit} KG
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-1">
                    <span className="text-gray-500">Availability</span>

                    <span className="font-medium text-green-600">
                      {product?.stock > 0 ? "Available" : "Out Of Stock"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* why us? */}
            <div className="flex justify-center gap-5">
              {/* card 1 */}
              <div className="flex flex-col items-center rounded-2xl border bg-white p-5 text-center shadow-sm">
                <div className="flex h-20 w-20 items-center justify-center">
                  <img
                    src={wideAssortmentImage}
                    alt="Wide Assortment"
                    className="h-full w-full object-contain"
                  />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-800">
                  Wide Assortment
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Choose from a large variety of grocery products.
                </p>
              </div>

              {/* card 2 */}
              <div className="flex flex-col items-center rounded-2xl border bg-white p-5 text-center shadow-sm">
                <div className="flex h-20 w-20 items-center justify-center">
                  <img
                    src={bestPriceAndOfferImage}
                    alt="Best Prices"
                    className="h-full w-full object-contain"
                  />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-800">
                  Best Prices & Offers
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Get products at the best market price with offers.
                </p>
              </div>

              {/* card 3 */}
              <div className="flex flex-col items-center rounded-2xl border bg-white p-5 text-center shadow-sm sm:col-span-2 lg:col-span-1">
                <div className="flex h-20 w-20 items-center justify-center">
                  <img
                    src={minuteDeliveryImage}
                    alt="Minute Delivery"
                    className="h-full w-full object-contain"
                  />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-800">
                  10 Minute Delivery
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Superfast delivery directly to your doorstep.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ProductDetailsPage;
