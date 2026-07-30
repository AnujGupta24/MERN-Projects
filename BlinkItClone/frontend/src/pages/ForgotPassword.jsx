import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await axiosInstance.post("/user/forgot-password", data);
      // console.log("FORGOT PASSWORD RES:", res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/verify-otp", {
          state: {
            email: data.email,
          },
        });
      }
    } catch (error) {
      console.log("FORGOT PASSWORD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-center text-2xl font-semibold">Forgot Password</h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          Enter your email to receive OTP
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className="focus:ring-primary-200 w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
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

          <button
            type="submit"
            disabled={loading}
            className="bg-primary-200 hover:bg-primary-100 flex w-full cursor-pointer items-center justify-center rounded-lg py-2 font-medium text-white transition disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
