import { useSelector } from "react-redux";
import {
  Mail,
  Phone,
  ShieldCheck,
  CalendarDays,
  Pencil,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";
import { setUser } from "../redux/userSlice";
import { Loader2 } from "lucide-react";
import { useState } from "react";

function Profile() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const orders = useSelector((state) => state.order.orders);
  const address = useSelector((state) => state.address.addressList);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const dispatch = useDispatch();
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleAvatarChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);

      dispatch(
        setUser({
          ...user,
          avatar: previewUrl,
        }),
      );

      setUploadingImage(true);

      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await axiosInstance.patch("/user/upload-avatar", formData);
      // console.log("UPLOAD AVATAR RES:", res);

      if (res.data.success) {
        dispatch(
          setUser({
            ...user,
            avatar: res.data.data.avatar,
          }),
        );

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("UPLOAD AVATAR ERROR:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* PAGE TITLE */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

        <button
          onClick={() => navigate("/dashboard/edit-profile")}
          className="bg-primary-200 hover:bg-primary-100 rounded-lg px-4 py-2 text-sm font-medium text-white transition"
        >
          Edit Profile
        </button>
      </div>

      {/* PROFILE CARD */}
      <div className="overflow-hidden rounded-3xl bg-white shadow">
        {/* TOP BANNER */}
        <div className="bg-primary-100/30 relative h-36">
          {/* AVATAR */}
          <div className="absolute bottom-0 left-8 translate-y-1/2">
            <div className="relative h-28 w-28">
              {!user?.avatar ? (
                <User size={40} />
              ) : (
                <img
                  src={user?.avatar || ""}
                  alt={user?.name}
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow"
                />
              )}

              {/* FILE INPUT */}
              <label className="bg-primary-200 absolute right-3 bottom-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white shadow-md transition hover:scale-105">
                {uploadingImage ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Pencil size={16} />
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* PROFILE DETAILS */}
        <div className="mt-16 p-8">
          {/* NAME + ROLE */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-800">{user?.name}</h2>

              <span className="bg-secondary-200/10 text-secondary-200 rounded-full px-3 py-1 text-xs font-semibold">
                {user?.role}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Account Status:{" "}
              <span className="font-medium text-green-600">{user?.status}</span>
            </p>
          </div>

          {/* INFO GRID */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* EMAIL */}
            <div className="flex items-start gap-4 rounded-2xl border border-gray-100 p-4">
              <div className="bg-primary-100/20 rounded-xl p-3">
                <Mail className="text-primary-200" size={20} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-800">{user?.email}</p>
              </div>
            </div>

            {/* MOBILE */}
            <div className="flex items-start gap-4 rounded-2xl border border-gray-100 p-4">
              <div className="bg-primary-100/20 rounded-xl p-3">
                <Phone className="text-primary-200" size={20} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Mobile Number</p>

                <p className="font-medium text-gray-800">
                  {user?.mobile || "Not Added"}
                </p>
              </div>
            </div>

            {/* EMAIL VERIFIED */}
            <div className="flex items-start gap-4 rounded-2xl border border-gray-100 p-4">
              <div className="bg-primary-100/20 rounded-xl p-3">
                <ShieldCheck className="text-primary-200" size={20} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Email Verification</p>

                <p
                  className={`font-medium ${
                    user?.verifyEmail ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {user?.verifyEmail ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>

            {/* JOINED DATE */}
            <div className="flex items-start gap-4 rounded-2xl border border-gray-100 p-4">
              <div className="bg-primary-100/20 rounded-xl p-3">
                <CalendarDays className="text-primary-200" size={20} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Joined On</p>

                <p className="font-medium text-gray-800">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* EXTRA STATS */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-blue-50 p-5">
              <p className="text-sm text-gray-500">Orders</p>

              <h3 className="mt-2 text-2xl font-bold text-gray-800">
                {orders?.length || 0}
              </h3>
            </div>

            <div className="rounded-2xl bg-green-50 p-5">
              <p className="text-sm text-gray-500">Saved Address</p>

              <h3 className="mt-2 text-2xl font-bold text-gray-800">
                {address.length || 0}
              </h3>
            </div>

            <div className="rounded-2xl bg-orange-50 p-5">
              <p className="text-sm text-gray-500">Cart Items</p>

              <h3 className="mt-2 text-2xl font-bold text-gray-800">
                {cartItems?.length || 0}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
