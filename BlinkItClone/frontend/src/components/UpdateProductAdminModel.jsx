import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";
import { Loader2, Trash2, Upload, X } from "lucide-react";

function UpdateProductAdminModel({ product, close, fetchProducts }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const allCategories = useSelector((state) => state.product.allCategory);
  const allSubCategories = useSelector((state) => state.product.subCategory);

  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState(product?.image || []);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [moreDetails, setMoreDetails] = useState([]);

  const [loading, setLoading] = useState(false);

  // setting prev values
  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("unit", product.unit);
      setValue("stock", product.stock);
      setValue("price", product.price);
      setValue("discount", product.discount);
      setValue("description", product.description);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCategory(product.category?._id);

      setSelectedSubCategories(product.subCategory?.map((sub) => sub._id));
      setMoreDetails(product.moreDetails || []);
    }
  }, [product, setValue]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const removeExistingImage = (index) => {
    const updatedImages = [...existingImages];
    updatedImages.splice(index, 1);
    setExistingImages(updatedImages);
  };

  const removeNewImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const handleSubCategorySelect = (e) => {
    const value = e.target.value;
    if (!value) return;
    const alreadyExists = selectedSubCategories.includes(value);
    if (alreadyExists) return;
    setSelectedSubCategories((prev) => [...prev, value]);
  };

  const removeSubCategory = (id) => {
    const filtered = selectedSubCategories.filter((item) => item !== id);
    setSelectedSubCategories(filtered);
  };

  const handleMoreDetailChange = (index, field, value) => {
    const updated = [...moreDetails];
    updated[index][field] = value;
    setMoreDetails(updated);
  };

  const addMoreDetailField = () => {
    setMoreDetails((prev) => [
      ...prev,
      {
        key: "",
        value: "",
      },
    ]);
  };

  const removeMoreDetailField = (index) => {
    const updated = [...moreDetails];
    updated.splice(index, 1);
    setMoreDetails(updated);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("category", selectedCategory);
      formData.append("subCategory", JSON.stringify(selectedSubCategories));
      formData.append("unit", data.unit);
      formData.append("stock", data.stock);
      formData.append("price", data.price);
      formData.append("discount", data.discount);
      formData.append("description", data.description);
      formData.append("moreDetails", JSON.stringify(moreDetails));
      formData.append("existingImages", JSON.stringify(existingImages));
      selectedImages.forEach((image) => {
        formData.append("image", image);
      });

      const res = await axiosInstance.patch(
        `/product/update-product/${product._id}`,
        formData,
      );
      // console.log("UPDATE PRODUCT ADMIN MODEL ", res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        fetchProducts();
        close();
      }
    } catch (error) {
      console.log("UPDATE PRODUCT ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 mt-12">
      <div className="max-h-[95vh] w-full max-w-6xl rounded-3xl bg-white p-6">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Update Product</h2>
            <p className="text-sm text-gray-500">Update your product details</p>
          </div>

          <button
            onClick={close}
            className="cursor-pointer rounded-full p-2 transition hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="no-scrollbar max-h-[calc(95vh-150px)] space-y-7 overflow-y-auto py-5"
        >
          {/* name */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">Product Name</label>

            <input
              type="text"
              placeholder="Enter product name"
              {...register("name", {
                required: "product name is required",
              })}
              className="focus:border-primary-200 w-full rounded-2xl border border-gray-300 p-3 outline-none"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* images */}
          <div className="space-y-4">
            <label className="font-medium text-gray-700">Product Images</label>
            <label className="hover:border-primary-200 flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 transition">
              <Upload size={35} />

              <span className="mt-3 text-sm text-gray-500">
                Upload Product Images
              </span>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* existing images */}
            <div className="flex flex-wrap gap-4">
              {existingImages.map((image, index) => (
                <div key={index} className="group relative">
                  <img
                    src={image}
                    alt="product"
                    className="h-28 w-28 rounded-2xl border object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-2 right-2 cursor-pointer rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}

              {/* new images */}
              {selectedImages.map((image, index) => (
                <div key={index} className="group relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    className="h-28 w-28 rounded-2xl border object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 cursor-pointer rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* category + subcategory */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* category */}
            <div className="space-y-2">
              <label className="font-medium text-gray-700">Category</label>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="focus:border-primary-200 w-full rounded-2xl border border-gray-300 p-3 outline-none"
              >
                <option value="">Select Category</option>

                {allCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* subcategory */}
            <div className="space-y-2">
              <label className="font-medium text-gray-700">
                Sub Categories
              </label>

              <select
                onChange={handleSubCategorySelect}
                className="focus:border-primary-200 w-full rounded-2xl border border-gray-300 p-3 outline-none"
              >
                <option value="">Select SubCategory</option>
                {allSubCategories.map((subCategory) => (
                  <option key={subCategory._id} value={subCategory._id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-2">
                {selectedSubCategories.map((subCategoryId) => {
                  const subCategory = allSubCategories.find(
                    (sub) => sub._id === subCategoryId,
                  );

                  return (
                    <div
                      key={subCategoryId}
                      className="bg-primary-100 flex items-center gap-2 rounded-full px-3 py-1 text-sm text-white"
                    >
                      <span>{subCategory?.name}</span>

                      <button
                        type="button"
                        onClick={() => removeSubCategory(subCategoryId)}
                      >
                        <X size={14} className="cursor-pointer" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* inputs */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col">
              <label htmlFor="">Unit</label>
              <input
                type="text"
                placeholder="unit/pcs"
                {...register("unit")}
                className="focus:border-primary-200 rounded-2xl border border-gray-300 p-3 outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="">Stock</label>
              <input
                type="number"
                placeholder="Stock"
                {...register("stock")}
                className="focus:border-primary-200 rounded-2xl border border-gray-300 p-3 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="">Price</label>
              <input
                type="number"
                placeholder="Price"
                {...register("price")}
                className="focus:border-primary-200 rounded-2xl border border-gray-300 p-3 outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="">Discount</label>
              <input
                type="number"
                placeholder="Discount"
                {...register("discount")}
                className="focus:border-primary-200 rounded-2xl border border-gray-300 p-3 outline-none"
              />
            </div>
          </div>

          {/* description */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">Description</label>

            <textarea
              rows={5}
              placeholder="Enter description"
              {...register("description")}
              className="focus:border-primary-200 w-full rounded-2xl border border-gray-300 p-3 outline-none"
            />
          </div>

          {/* more details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-medium text-gray-700">More Details</label>

              <button
                type="button"
                onClick={addMoreDetailField}
                className="bg-primary-200 cursor-pointer rounded-xl px-4 py-2 text-sm text-white"
              >
                Add Field
              </button>
            </div>

            {moreDetails.map((detail, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-4 md:flex-row"
              >
                <input
                  type="text"
                  placeholder="Key"
                  value={detail.key}
                  onChange={(e) =>
                    handleMoreDetailChange(index, "key", e.target.value)
                  }
                  className="focus:border-primary-200 flex-1 rounded-xl border border-gray-300 p-3 outline-none"
                />

                <input
                  type="text"
                  placeholder="Value"
                  value={detail.value}
                  onChange={(e) =>
                    handleMoreDetailChange(index, "value", e.target.value)
                  }
                  className="focus:border-primary-200 flex-1 rounded-xl border border-gray-300 p-3 outline-none"
                />

                <button
                  type="button"
                  onClick={() => removeMoreDetailField(index)}
                  className="flex cursor-pointer items-center justify-center rounded-xl bg-red-500 px-4 text-white"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={close}
              className="cursor-pointer rounded-2xl border border-gray-300 px-6 py-3 font-medium"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              type="submit"
              className="bg-primary-200 cursor-pointer rounded-2xl px-6 py-3 font-medium text-white"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Update Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default UpdateProductAdminModel;
