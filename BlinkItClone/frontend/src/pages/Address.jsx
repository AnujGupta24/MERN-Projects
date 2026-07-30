import { MapPin, Pencil, Phone, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";
import { setAddress } from "../redux/addressSlice";
import AddAddress from "../components/AddAddress";
import EditAddress from "../components/EditAddress";
import NoData from "../components/NoData";

function Address() {
  const addresses = useSelector((state) => state.address.addressList);

  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const dispatch = useDispatch();

  const deleteAddressHandler = async (addressId) => {
    try {
      const res = await axiosInstance.delete(
        `/address/delete-address/${addressId}`,
      );
      // console.log("deleteAddressHandler res", res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAddress(res.data.data));
      }
    } catch (error) {
      console.log("deleteAddressHandler error ", error);
    }
  };
  return (
    <>
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Address</h1>
          <p className="text-sm text-gray-500">Manage your addresses here</p>
        </div>

        <button
          onClick={() => setOpenAddressModal(true)}
          className="bg-primary-200 hover:bg-primary-100 cursor-pointer rounded-xl px-5 py-2.5 font-medium text-white transition"
        >
          Add Address
        </button>
      </div>

      {/* ADDRESS LIST / EMPTY STATE */}
      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <NoData />
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="group relative rounded-2xl bg-white p-5 shadow-md transition hover:shadow-lg"
            >
              {/* TOP */}
              <div className="flex items-start gap-3">
                <div className="bg-primary-100 rounded-full p-2 text-gray-700">
                  <MapPin size={20} />
                </div>

                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800">
                    {address.addressLine}
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    {address.city}, {address.state}
                  </p>

                  <p className="text-sm text-gray-600">
                    {address.country} - {address.pincode}
                  </p>
                </div>

                <button
                  onClick={() => deleteAddressHandler(address._id)}
                  className="absolute top-4 right-4 cursor-pointer rounded-full bg-red-50 p-2 text-red-500 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>

                <button
                  onClick={() => {
                    setSelectedAddress(address);
                    setOpenEditModal(true);
                  }}
                  className="absolute top-4 right-16 cursor-pointer rounded-full bg-green-50 p-2 text-green-500 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-green-100 hover:text-green-600"
                >
                  <Pencil size={18} />
                </button>
              </div>

              {/* MOBILE */}
              <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-sm text-gray-700">
                <Phone size={16} />
                <span>{address.mobile}</span>
              </div>

              {/* STATUS */}
              <div className="mt-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    address.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {address.status ? "Active Address" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {openAddressModal && (
        <AddAddress close={() => setOpenAddressModal(false)} />
      )}

      {openEditModal && selectedAddress && (
        <EditAddress
          address={selectedAddress}
          close={() => setOpenEditModal(false)}
        />
      )}
    </>
  );
}

export default Address;
