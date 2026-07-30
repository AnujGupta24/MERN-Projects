import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

function UpdateCategoryModel({ close, category, fetchData }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: category?.name,
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", data.name);

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      const res = await axiosInstance.patch(
        `/category/update-category/${category._id}`,
        formData,
      );

      if (res.data.success) {
        toast.success(res.data.message);
        await fetchData();
        close();
      }
    } catch (error) {
      console.log("UPDATE CATEGORY ERROR:", error);
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
            Update Category
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
              Category Name
            </label>

            <input
              type="text"
              className="focus:ring-primary-200 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2"
              {...register("name", {
                required: "Category name is required",
              })}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* IMAGE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category Image
            </label>

            <input
              type="file"
              accept="image/*"
              className="w-full rounded-xl border border-gray-200 p-3"
              {...register("image")}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={close}
              className="cursor-pointer rounded-xl border border-gray-300 px-5 py-2.5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary-200 cursor-pointer rounded-xl px-5 py-2.5 text-white"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Update Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateCategoryModel;
