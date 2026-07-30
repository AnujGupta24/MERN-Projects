import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

function UploadCategoryModel({ close, fetchData }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // console.log("formdata", data);

      const formData = new FormData();
      formData.append("name", data.name);

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      const res = await axiosInstance.post("/category/add-category", formData);

      if (res.data.success) {
        toast.success(res.data.message);
        reset();
        await fetchData();
        close();
      }
    } catch (error) {
      console.log("ADD CATEGORY ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <h2 className="text-xl font-semibold text-gray-800">Add Category</h2>

          <button
            onClick={close}
            className="rounded-full p-2 cursor-pointer transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-5">
          {/* CATEGORY NAME */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category Name
            </label>

            <input
              type="text"
              placeholder="Enter category name"
              className="focus:ring-primary-200 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2"
              {...register("name", {
                required: "Category name is required",
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* CATEGORY IMAGE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category Image
            </label>

            <input
              type="file"
              accept="image/*"
              className="w-full rounded-xl border border-gray-200 p-3"
              {...register("image", {
                required: "Category image is required",
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
              className="rounded-xl border border-gray-300 cursor-pointer px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
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
                "Add Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadCategoryModel;
