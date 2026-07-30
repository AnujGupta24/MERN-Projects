import axiosInstance from "../utils/axios";
import { useEffect, useRef, useState } from "react";
import CategoryCard from "./CategoryCard";
import Skeleton from "./Skeleton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function CategoryWiseShowProduct({ categoryId, categoryName }) {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const subCategoryData = useSelector((state) => state.product.subCategory);

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.post("/product/get-product-by-category", {
        id: categoryId,
      });
      // console.log("fetchCategoryWiseProducts res", res.data);

      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.log("fetchcategory wise error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategoryWiseProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };
  const handleScrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  const slugify = (text = "") => {
    return text
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/,/g, "")
      .replace(/\s+/g, "-");
  };

  const categorySubCategories = subCategoryData.filter(
    (sub) => sub.category?._id === categoryId,
  );

  const firstSubCategory = categorySubCategories[0];

  if (!loading && data.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto mb-10 max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="mb-5 text-xl font-bold text-gray-800">{categoryName}</h2>
        <Link
          to={
            firstSubCategory
              ? `/${slugify(categoryName)}-${categoryId}/${slugify(
                  firstSubCategory.name,
                )}-${firstSubCategory._id}`
              : "#"
          }
          className="text-xs font-medium text-green-600 hover:text-green-500"
        >
          See All
        </Link>
      </div>

      <div className="relative">
        {loading ? (
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} />
            ))}
          </div>
        ) : (
          <>
            <div
              ref={scrollRef}
              className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2"
            >
              {data?.map((d) => (
                <CategoryCard key={d._id} product={d} />
              ))}
            </div>

            <div className="pointer-events-none absolute inset-y-0 right-0 left-0 flex items-center justify-between">
              <button
                onClick={handleScrollLeft}
                className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition hover:scale-105 hover:bg-gray-100 active:scale-95"
              >
                <ArrowLeft size={20} className="text-gray-700" />
              </button>

              <button
                onClick={handleScrollRight}
                className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition hover:scale-105 hover:bg-gray-100 active:scale-95"
              >
                <ArrowRight size={20} className="text-gray-700" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default CategoryWiseShowProduct;
