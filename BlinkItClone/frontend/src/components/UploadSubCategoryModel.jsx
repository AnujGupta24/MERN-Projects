import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

const UploadSubCategoryModel = ({ close, fetchData }) => {
  const [loading, setLoading] = useState(false);
  const allCategoryData = useSelector((state) => state.product.allCategory);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      const res = await axiosInstance.post(
        "/subcategory/add-subcategory",
        formData,
      );
      // console.log("SUBCATEGORYMODEL RES", res);

      if (res.data.success) {
        toast.success(res.data.message);
        reset();
        fetchData();
        close();
      }
    } catch (error) {
      console.log("ADD SUBCATEGORY ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Add SubCategory
          </h2>

          <button
            onClick={close}
            className="cursor-pointer rounded-full p-2 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-5">
          {/* NAME */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              SubCategory Name
            </label>

            <input
              type="text"
              placeholder="Enter subcategory name"
              className="focus:ring-primary-200 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2"
              {...register("name", {
                required: "Subcategory name is required",
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* CATEGORY */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Category
            </label>

            <select
              className="focus:ring-primary-200 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2"
              {...register("category", {
                required: "Category is required",
              })}
            >
              <option value="">Select Category</option>

              {allCategoryData.map((cat) => (
                <option key={cat?._id} value={cat._id}>
                  {cat?.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* IMAGE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              SubCategory Image
            </label>

            <input
              type="file"
              accept="image/*"
              className="w-full rounded-xl border border-gray-200 p-3"
              {...register("image", {
                required: "Image is required",
              })}
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-500">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={close}
              className="cursor-pointer rounded-xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary-200 hover:bg-primary-100 cursor-pointer rounded-xl px-5 py-2.5 font-medium text-white transition"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Add SubCategory"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadSubCategoryModel;
