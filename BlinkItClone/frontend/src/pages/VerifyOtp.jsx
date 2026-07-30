import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import OtpInput from "react-otp-input";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const verifyOtpHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axiosInstance.post("/user/verify-forgot-password-otp", {
        email,
        otp,
      });
      // console.log("VERIFY OTP:", res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/reset-password", {
          state: {
            email,
            otp,
          },
        });
      }
    } catch (error) {
      console.log("VERIFY OTP ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-center text-2xl font-semibold">Verify OTP</h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          Enter the 6 digit OTP sent to your email
        </p>

        <form onSubmit={verifyOtpHandler} className="mt-6 space-y-5">
          <div className="flex justify-center">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              shouldAutoFocus={true}
              inputStyle={{
                width: "45px",
                height: "45px",
              }}
              renderInput={(props) => (
                <input
                  {...props}
                  className="focus:border-primary-200 mx-1 rounded-2xl border text-center text-xl outline-none"
                />
              )}
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="bg-primary-200 hover:bg-primary-100 flex w-full cursor-pointer items-center justify-center rounded-lg py-2 font-medium text-white transition disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;
