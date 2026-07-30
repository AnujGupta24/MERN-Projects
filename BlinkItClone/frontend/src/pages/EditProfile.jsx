import { useDispatch, useSelector } from "react-redux";
import { Loader2, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";
import { setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";

function EditProfile() {
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
      };

      // send password only if user entered it
      if (data.password) {
        payload.password = data.password;
      }

      const res = await axiosInstance.patch("/user/edit-user-details", payload);
      // console.log("EDIT PROFILE RES:", res);

      if (res.data.success) {
        dispatch(setUser(res.data.data));
        toast.success(res.data.message);
        navigate("/dashboard/profile");
      }
    } catch (error) {
      console.log("EDIT PROFILE ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Profile</h1>

        <p className="mt-1 text-sm text-gray-500">
          Update your personal information
        </p>
      </div>

      {/* CARD */}
      <div className="rounded-3xl bg-white p-8 shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* USER INFO */}
          <div className="flex items-center gap-5 rounded-2xl bg-gray-50 p-5">
            {!user?.avatar ? (
              <User size={40} />
            ) : (
              <img
                src={user?.avatar || ""}
                alt={user?.name}
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow"
              />
            )}

            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>

              <p className="text-gray-500">{user?.email}</p>

              <p className="mt-1 text-sm text-green-600">
                Account Status: {user?.status}
              </p>
            </div>
          </div>

          {/* FORM GRID */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                className="focus:ring-primary-200 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2"
                {...register("name", {
                  required: "Name is required",
                })}
              />

              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter email"
                className="focus:ring-primary-200 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />

              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* MOBILE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Mobile Number
              </label>

              <input
                type="number"
                placeholder="Enter mobile number"
                className="focus:ring-primary-200 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2"
                {...register("mobile")}
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Role
              </label>

              <input
                type="text"
                disabled
                value={user?.role}
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="focus:ring-primary-200 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2"
                  {...register("password", {
                    minLength: {
                      value: 4,
                      message: "Minimum 4 characters required",
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className="focus:ring-primary-200 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2"
                  {...register("confirmPassword", {
                    validate: (value) =>
                      value === getValues("password") ||
                      "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <IoEyeOff size={20} />
                  ) : (
                    <IoEye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/profile")}
              className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary-200 hover:bg-primary-100 flex min-w-40 items-center justify-center rounded-xl px-6 py-3 font-medium text-white transition"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
