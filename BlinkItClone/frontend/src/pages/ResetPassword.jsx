import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoEye, IoEyeOff } from "react-icons/io5";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";

function ResetPassword() {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();

  // receive email + otp from forgot password page
  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data) => {
    // console.log("formddata", data);
    try {
      setLoading(true);

      const payload = {
        email,
        otp,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };

      const res = await axiosInstance.post("/user/reset-password", payload);
      // console.log("RESET PASSWORD RESPONSE:", res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        reset();
        navigate("/login");
      }
    } catch (error) {
      console.log("RESET PASSWORD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-center text-2xl font-semibold">Reset Password</h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          Create your new password
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* new password */}
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              className="focus:ring-primary-200 w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
              {...register("newPassword", {
                required: "New password is required",

                minLength: {
                  value: 4,
                  message: "Minimum 4 characters required",
                },
              })}
            />

            {/* toggle */}
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showNewPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
            </button>

            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* confirm password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="focus:ring-primary-200 w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
              {...register("confirmPassword", {
                required: "Confirm password is required",

                validate: (value) =>
                  value === getValues("newPassword") ||
                  "Passwords do not match",
              })}
            />

            {/* toggle */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showConfirmPassword ? (
                <IoEyeOff size={20} />
              ) : (
                <IoEye size={20} />
              )}
            </button>

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* btn */}
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-200 hover:bg-primary-100 flex w-full cursor-pointer items-center justify-center rounded-lg py-2 font-medium text-white transition disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
