import { useState } from "react";
import NoData from "../components/NoData";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
import axiosInstance from "../utils/axios";
import { PenIcon, Trash2 } from "lucide-react";
import UpdateSubCategoryModel from "../components/UpdateSubCategoryModel";
import toast from "react-hot-toast";
import DeleteConfirmModel from "../components/DeleteConfirmModel";
import { useDispatch, useSelector } from "react-redux";
import { setSubCategory } from "../redux/productSlice";

function SubCategory() {
  const dispatch = useDispatch();
  const subCategoryData = useSelector((state) => state.product.subCategory);
  const [openUploadSubCategory, setOpenUploadSubCategory] = useState(false);

  const [openEditSubCategory, setOpenEditSubCategory] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteSubCategoryId, setDeleteSubCategoryId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(subCategoryData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIndex = startIdx + itemsPerPage;
  const currentSubCategories = subCategoryData.slice(startIdx, endIndex);

  const fetchSubCategory = async () => {
    try {
      const res = await axiosInstance.get("/subcategory/all-subcategories");
      // console.log("fetch SUB CATEGORY RES", res.data.data);

      if (res.data.success) {
        dispatch(setSubCategory(res.data.data));
      }
    } catch (error) {
      console.log("fetchSubCategory error", error);
    }
  };

  const editSubCategoryHandler = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setOpenEditSubCategory(true);
  };

  const openDeleteHandler = (id) => {
    setDeleteSubCategoryId(id);
    setOpenDeleteModal(true);
  };

  const deleteSubCategoryHandler = async (subCategoryid) => {
    try {
      const res = await axiosInstance.delete(
        `/subcategory/delete-subcategory/${subCategoryid}`,
      );
      // console.log("DELETE SUBCATEGORY RES:", res.data);

      if (res.data.success) {
        if (currentSubCategories.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
        toast.success(res.data.message);
        await fetchSubCategory();
      }
    } catch (error) {
      console.log("DELETE SUBCATEGORY ERROR:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">SubCategories</h1>
          <p className="text-sm text-gray-500">
            Manage all products sub category
          </p>
        </div>

        <button
          onClick={() => setOpenUploadSubCategory(true)}
          className="bg-primary-200 hover:bg-primary-100 cursor-pointer rounded-xl px-5 py-2.5 font-medium text-white transition"
        >
          Add SubCategory
        </button>
      </div>

      {/* SUBCATEGORY CARD */}
      <div className="rounded-2xl bg-white">
        <div className="border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Sub Category Lists</h2>
        </div>

        {/* SUBCATEGORY CONTENT */}
        <div className="p-3">
          {subCategoryData.length === 0 ? (
            <div className="flex items-center justify-center">
              <NoData />
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                        Image
                      </th>

                      <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                        SubCategory
                      </th>

                      <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                        Category
                      </th>

                      <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {/*replace currentSubCategories with subCategoryData.map if not work */}
                    {currentSubCategories.map((subCategory) => (
                      <tr
                        key={subCategory._id}
                        className="border-t border-gray-100"
                      >
                        {/* IMAGE */}
                        <td className="px-3 py-4">
                          <img
                            src={subCategory.image}
                            alt={subCategory.name}
                            className="h-36 w-36 rounded-xl border border-gray-400"
                          />
                        </td>

                        {/* SUBCATEGORY */}
                        <td className="px-5 py-4 font-medium text-gray-800">
                          {subCategory.name}
                        </td>

                        {/* CATEGORY */}
                        <td className="px-5 py-4 text-gray-600">
                          {subCategory.category?.name}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              onClick={() =>
                                editSubCategoryHandler(subCategory)
                              }
                              className="text-blue-600 hover:scale-110"
                            >
                              <PenIcon size={20} />
                            </div>

                            <div
                              onClick={() => openDeleteHandler(subCategory._id)}
                              className="medium text-red-500 hover:scale-110"
                            >
                              <Trash2 size={20} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="rounded-lg border px-4 py-2 disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <span>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="rounded-lg border px-4 py-2 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {openUploadSubCategory && (
          <UploadSubCategoryModel
            fetchData={fetchSubCategory}
            close={() => setOpenUploadSubCategory(false)}
          />
        )}

        {openEditSubCategory && (
          <UpdateSubCategoryModel
            selectedSubCategory={selectedSubCategory}
            fetchData={fetchSubCategory}
            close={() => {
              setOpenEditSubCategory(false);
              setSelectedSubCategory(null);
            }}
          />
        )}

        {openDeleteModal && (
          <DeleteConfirmModel
            title="Delete SubCategory?"
            subtitle="This action cannot be undone."
            close={() => {
              setOpenDeleteModal(false);
              setDeleteSubCategoryId(null);
            }}
            onDelete={() => deleteSubCategoryHandler(deleteSubCategoryId)}
          />
        )}
      </div>
    </div>
  );
}

export default SubCategory;
