import { Loader2, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";
import { setAllProducts } from "../redux/productSlice";

function UploadProduct() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const allCategories = useSelector((state) => state.product.allCategory);
  const allSubCategories = useSelector((state) => state.product.subCategory);

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [moreDetails, setMoreDetails] = useState([]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);

      selectedImages.forEach((image) => {
        formData.append("image", image);
      });

      formData.append("category", selectedCategory);
      formData.append("subCategory", JSON.stringify(selectedSubCategories));
      formData.append("unit", data.unit);
      formData.append("stock", data.stock);
      formData.append("price", data.price);
      formData.append("discount", data.discount);
      formData.append("description", data.description);
      formData.append("moreDetails", JSON.stringify(moreDetails));

      const res = await axiosInstance.post("/product/create-product", formData);
      // console.log("upload product api res", res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAllProducts(res.data.data));
        // reset();
        setSelectedImages([]);
        setMoreDetails([]);
      }
    } catch (error) {
      console.log("UPLOAD PRODUCT ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const removeImage = (idx) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(idx, 1);
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
    const updatedDetails = [...moreDetails];
    updatedDetails[index][field] = value;
    setMoreDetails(updatedDetails);
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
    const updatedDetails = [...moreDetails];
    updatedDetails.splice(index, 1);
    setMoreDetails(updatedDetails);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Upload Product</h1>
          <p className="text-sm text-gray-500">Add and manage store products</p>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="rounded-2xl bg-white">
        {/* CARD HEADER */}
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-700">Product Information</h2>
        </div>

        {/* CARD CONTENT */}
        <div className="p-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* PRODUCT NAME */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Product Name
              </label>

              <input
                type="text"
                placeholder="Enter product name"
                {...register("name")}
                className="focus:border-primary-200 w-full rounded-xl border border-gray-200 px-4 py-3 transition outline-none"
              />
            </div>

            {/* PRODUCT IMAGES */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">
                Product Images
              </label>

              <label className="hover:border-primary-200 hover:bg-primary-50 flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition">
                <Upload size={36} className="text-gray-400" />

                <span className="mt-3 text-sm font-medium text-gray-600">
                  Click to upload images
                </span>

                <span className="mt-1 text-xs text-gray-400">
                  PNG, JPG, JPEG
                </span>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* PREVIEW */}
              <div className="flex flex-wrap gap-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="group relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="preview"
                      className="h-28 w-28 rounded-2xl border border-gray-200 object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CATEGORY SECTION */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* CATEGORY */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="focus:border-primary-200 w-full rounded-xl border border-gray-200 px-4 py-3 transition outline-none"
                >
                  <option value="">Select Category</option>

                  {allCategories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUBCATEGORY */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Sub Categories
                </label>

                <select
                  onChange={handleSubCategorySelect}
                  className="focus:border-primary-200 w-full rounded-xl border border-gray-200 px-4 py-3 transition outline-none"
                >
                  <option value="">Select SubCategory</option>

                  {allSubCategories.map((subCategory) => (
                    <option key={subCategory._id} value={subCategory._id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>

                {/* SELECTED */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedSubCategories.map((subCategoryId) => {
                    const subCategory = allSubCategories.find(
                      (sub) => sub._id === subCategoryId,
                    );

                    return (
                      <div
                        key={subCategoryId}
                        className="bg-primary-50 text-primary-200 flex items-center gap-2 rounded-full px-3 py-1 text-sm"
                      >
                        <span>{subCategory?.name}</span>

                        <button
                          type="button"
                          onClick={() => removeSubCategory(subCategoryId)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* PRODUCT DETAILS */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Unit
                </label>

                <input
                  type="text"
                  placeholder="kg / pcs"
                  {...register("unit")}
                  className="focus:border-primary-200 w-full rounded-xl border border-gray-200 px-4 py-3 transition outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Stock
                </label>

                <input
                  type="number"
                  placeholder="Stock"
                  {...register("stock")}
                  className="focus:border-primary-200 w-full rounded-xl border border-gray-200 px-4 py-3 transition outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Price
                </label>

                <input
                  type="number"
                  placeholder="Price"
                  {...register("price")}
                  className="focus:border-primary-200 w-full rounded-xl border border-gray-200 px-4 py-3 transition outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Discount %
                </label>

                <input
                  type="number"
                  placeholder="Discount"
                  {...register("discount")}
                  className="focus:border-primary-200 w-full rounded-xl border border-gray-200 px-4 py-3 transition outline-none"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                rows={5}
                placeholder="Enter product description"
                {...register("description")}
                className="focus:border-primary-200 w-full rounded-xl border border-gray-200 px-4 py-3 transition outline-none"
              />
            </div>

            {/* MORE DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  More Details
                </label>

                <button
                  type="button"
                  onClick={addMoreDetailField}
                  className="bg-primary-200 hover:bg-primary-100 rounded-xl px-4 py-2 text-sm font-medium text-white transition"
                >
                  Add Field
                </button>
              </div>

              {moreDetails.map((detail, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 md:flex-row"
                >
                  <input
                    type="text"
                    placeholder="Key"
                    value={detail.key}
                    onChange={(e) =>
                      handleMoreDetailChange(index, "key", e.target.value)
                    }
                    className="focus:border-primary-200 flex-1 rounded-xl border border-gray-200 px-4 py-3 transition outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={detail.value}
                    onChange={(e) =>
                      handleMoreDetailChange(index, "value", e.target.value)
                    }
                    className="focus:border-primary-200 flex-1 rounded-xl border border-gray-200 px-4 py-3 transition outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeMoreDetailField(index)}
                    className="flex items-center justify-center rounded-xl bg-red-500 px-4 text-white transition hover:bg-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <div className="flex w-full justify-end">
                <button
                  type="submit"
                  className="bg-primary-200 hover:bg-primary-100 cursor-pointer rounded-xl px-5 py-2.5 font-medium text-white transition"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={26} />
                  ) : (
                    "Upload Product"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadProduct;
