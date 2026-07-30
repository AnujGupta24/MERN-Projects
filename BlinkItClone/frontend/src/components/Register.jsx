import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import axiosInstance from "../utils/axios";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

function Register() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/user/register", data);
      // console.log(res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        reset();
        navigate("/verify-email", {
          state: {
            code: res.data.data._id,
          },
        });
      }
    } catch (error) {
      console.log("REGISTER ERROR: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Welcome to BlinkIt Clone
          <p className="text-lg">Create Account</p>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              className="focus:ring-primary-200 w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters required",
                },
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email Address"
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

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="focus:ring-primary-200 w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 4,
                  message: "Minimum 4 characters required",
                },
              })}
            />
            {/* toggle pwd */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
            </button>

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-200 hover:bg-primary-100 flex w-full cursor-pointer items-center justify-center rounded-lg py-2 font-medium text-white transition"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-200 cursor-pointer font-medium underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
