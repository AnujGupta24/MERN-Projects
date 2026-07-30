import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";
import { setAddress } from "../redux/addressSlice";
import { useDispatch, useSelector } from "react-redux";

const AddAddress = ({ close }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.address.addressList);

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/address/add-address", data);
      // console.log("add address res", res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAddress([...addresses, res.data.data]));
        close();
        reset();
      }
    } catch (error) {
      console.log("Add Address error ", error);
    }
  };

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Add Address</h2>

          <button
            onClick={close}
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* ADDRESS LINE */}
          <div>
            <input
              type="text"
              placeholder="Address Line"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-green-500"
              {...register("addressLine", {
                required: "Address is required",
              })}
            />
            {errors.addressLine && (
              <p className="mt-1 text-sm text-red-500">
                {errors.addressLine.message}
              </p>
            )}
          </div>

          {/* CITY + STATE */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="City"
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-green-500"
                {...register("city", {
                  required: "City is required",
                })}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="State"
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-green-500"
                {...register("state", {
                  required: "State is required",
                })}
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.state.message}
                </p>
              )}
            </div>
          </div>

          {/* PINCODE + COUNTRY */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Pincode"
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-green-500"
                {...register("pincode", {
                  required: "Pincode is required",
                })}
              />
              {errors.pincode && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.pincode.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Country"
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-green-500"
                {...register("country", {
                  required: "Country is required",
                })}
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          {/* MOBILE */}
          <div>
            <input
              type="tel"
              placeholder="Mobile Number"
              className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-green-500"
              {...register("mobile", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter valid mobile number",
                },
              })}
            />
            {errors.mobile && (
              <p className="mt-1 text-sm text-red-500">
                {errors.mobile.message}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button className="bg-primary-200 hover:bg-primary-100 w-full rounded-xl py-3 font-semibold text-white transition">
            Save Address
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddAddress;
