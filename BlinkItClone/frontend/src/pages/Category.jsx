import { useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";
import NoData from "../components/NoData";
import UpdateCategoryModel from "../components/UpdateCategoryModel";
import { useDispatch, useSelector } from "react-redux";
import { setAllCategory, setLoadingCategory } from "../redux/productSlice";

function Category() {
  const dispatch = useDispatch();
  const allCategoryData = useSelector((state) => state.product.allCategory);

  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openUploadCategory, setOpenUploadCategory] = useState(false);

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const res = await axiosInstance.get("/category/all-categories");

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAllCategory(res.data.data));
      }
    } catch (error) {
      console.log("fetchCategory error", error);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      const res = await axiosInstance.delete(
        `/category/delete-category/${categoryId}`,
      );

      console.log("DELETE RESPONSE", res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        await fetchCategory();
      }
    } catch (error) {
      console.log("DELETE CATEGORY ERROR:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-sm text-gray-500">Manage product categories</p>
        </div>

        <button
          onClick={() => setOpenUploadCategory(true)}
          className="bg-primary-200 hover:bg-primary-100 cursor-pointer rounded-xl px-5 py-2.5 font-medium text-white transition"
        >
          Add Category
        </button>
      </div>

      {/* CATEGORY CARD */}
      <div className="rounded-2xl bg-white">
        <div className="border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Category Lists</h2>
        </div>

        {/* CATEGORY CONTENT */}
        <div className="p-3">
          {allCategoryData.length === 0 ? (
            <div className="flex items-center justify-center">
              <NoData />
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {allCategoryData.map((category) => (
                <div
                  key={category._id}
                  className="group overflow-hidden rounded-2xl border border-gray-300 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* IMAGE */}
                  <div className="bg-gray-50 p-2">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-40 w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="border-t border-gray-100 p-4">
                    <h3 className="line-clamp-1 text-lg font-semibold text-gray-800">
                      {category.name}
                    </h3>
                    <div className="mt-3 hidden items-center justify-between group-hover:flex">
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setOpenEditCategory(true);
                        }}
                        className="cursor-pointer text-sm font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(category._id)}
                        className="cursor-pointer text-sm font-medium text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {openUploadCategory && (
        <UploadCategoryModel
          fetchData={fetchCategory}
          close={() => setOpenUploadCategory(false)}
        />
      )}

      {openEditCategory && (
        <UpdateCategoryModel
          category={selectedCategory}
          fetchData={fetchCategory}
          close={() => {
            setOpenEditCategory(false);
            setSelectedCategory(null);
          }}
        />
      )}
    </div>
  );
}

export default Category;
