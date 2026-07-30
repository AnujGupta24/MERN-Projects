import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../utils/axios";
import CategoryCard from "../components/CategoryCard";
import Skeleton from "../components/Skeleton";
import { useSelector } from "react-redux";
import NoData from "../components/NoData";

function ProductListPage() {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [displaySubCategory, setDisplaySubCategory] = useState([]);
  const allSubCategory = useSelector((state) => state.product.subCategory);

  const params = useParams();
  const categoryId = params.category?.split("-").pop();
  const subCategoryId = params.subcategory?.split("-").pop();

  const [data, setData] = useState([]);
  const limit = 3;

  const slugify = (text = "") => {
    return text
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/,/g, "")
      .replace(/\s+/g, "-");
  };

  const fetchProductListData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/product/get-product-by-category-and-subcategory",
        {
          categoryId,
          subCategoryId,
          page,
          limit,
        },
      );
      // console.log("fetch Product List Data response", res.data);

      if (res.data.success) {
        setData(res.data.data.products);
        setTotalPage(res.data.data.totalPages);
      }
    } catch (error) {
      console.log("FETCH DATA ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  // fetch product
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProductListData();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subCategoryId, params, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [subCategoryId]);

  useEffect(() => {
    const sub = allSubCategory.filter((s) => {
      const filterData = s.category._id === categoryId;
      return filterData;
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplaySubCategory(sub);
  }, [allSubCategory, categoryId, params]);

  return (
    <div className="bg-gray-100">
      <div className="mx-auto flex h-[calc(100vh-100px)] max-w-6xl gap-4 overflow-hidden p-4">
        {/* LEFT SIDEBAR */}
        <div className="w-70 bg-white shadow-sm">
          {/* Heading */}
          <div className="border-b border-b-gray-400 p-4">
            <h2 className="text-xl font-bold text-gray-800">Sub Categories</h2>
          </div>

          {/* SubCategory List */}
          <div className="no-scrollbar h-full overflow-y-auto pb-20">
            {displaySubCategory?.map((sub) => {
              const isActive = sub._id === subCategoryId;

              return (
                <Link
                  to={`/${params.category}/${slugify(sub.name)}-${sub._id}`}
                  key={sub._id}
                  className={`flex cursor-pointer items-center gap-3 border-b border-b-gray-200 p-4 transition ${
                    isActive ? "bg-green-50" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Image */}
                  <div className="h-14 w-14 overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        isActive ? "text-green-700" : "text-gray-700"
                      }`}
                    >
                      {sub.name}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="no-scrollbar flex-1 overflow-y-auto bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-gray-800 capitalize">
            {params.subcategory.split("-").slice(0, -1).join(" ")}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array(6)
                .fill(null)
                .map((_, index) => (
                  <Skeleton key={index} />
                ))}
            </div>
          ) : data.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((product) => (
                  <CategoryCard key={product._id} product={product} />
                ))}
              </div>

              {/* pagination */}
              {totalPage > 1 && (
                <div className="mt-20 flex items-center justify-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPage }, (_, index) => {
                    const pageNumber = index + 1;

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`h-10 w-10 rounded-lg border transition ${
                          page === pageNumber
                            ? "bg-green-600 text-white"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  <button
                    disabled={page === totalPage}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-100 items-center justify-center">
              <NoData />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProductListPage;
