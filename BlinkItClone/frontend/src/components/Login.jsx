import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import fetchCartItems from "../utils/fetchCartItems";

function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/user/login", data);
      console.log("LOGIN RES: ", res.data.data.user);

      if (res.data.success) {
        dispatch(setUser(res.data.data.user));
        await fetchCartItems(dispatch);
        toast.success(res.data.message);
        reset();
        navigate("/");
      }
    } catch (error) {
      console.log("LOGIN ERROR: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Login to your account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/3 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
            </button>

            <Link
              to="/forgot-password"
              className="flex justify-end text-xs text-red-500 underline"
            >
              Forgot password?
            </Link>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary-200 hover:bg-primary-100 flex w-full cursor-pointer items-center justify-center rounded-lg py-2 font-medium text-white transition"
          >
            {loading ? <Loader2 className="animate-spin" size={22} /> : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-primary-200 font-medium underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
