import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axios";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // code received from register page
  const code = location.state?.code || "";

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axiosInstance.post("/user/verify-email", {
        code,
      });
      // console.log("VERIFY RESPONSE:", res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log("VERIFY ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-center text-2xl font-semibold">Verify Email</h2>

        <p className="mt-2 text-center text-gray-500">
          Click below to verify your account
        </p>

        {/* SHOW CODE */}
        <div className="mt-5 rounded-lg bg-gray-100 p-3 text-center break-all">
          <p className="text-sm text-gray-500">Verification Code</p>

          <p className="mt-1 font-medium">{code}</p>
        </div>

        <form onSubmit={submitHandler} className="mt-6">
          <button
            type="submit"
            disabled={loading || !code}
            className="bg-primary-200 hover:bg-primary-100 flex w-full cursor-pointer items-center justify-center rounded-lg py-2 font-medium text-white transition disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              "Verify Email"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmail;
