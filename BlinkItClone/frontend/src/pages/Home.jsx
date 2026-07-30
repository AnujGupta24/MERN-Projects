import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import banner from "../assets/banner.jpg";
import Skeleton from "../components/Skeleton";
import CategoryWiseShowProduct from "../components/CategoryWiseShowProduct";

function Home() {
  const loading = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.subCategory);

  const slugify = (text) => {
    return text
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/,/g, "")
      .replace(/\s+/g, "-");
  };

  return (
    <div className="bg-gray-50">
      <div className="container px-4 py-4">
        <div
          className={`h-full min-h-48 w-full overflow-hidden rounded-3xl bg-blue-100 select-none ${!banner && "animate-pulse"}`}
        >
          <img
            src={banner}
            className="h-full w-full object-cover"
            alt="banner"
          />
        </div>
      </div>

      {/* category */}
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-5 text-2xl font-bold text-gray-800">
          Shop by Category
        </h2>
        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categoryData?.map((category) => {
              const relatedSubCategory = subCategoryData.find(
                (sub) => sub.category?._id === category._id,
              );

              if (!relatedSubCategory) return null;

              return (
                <Link
                  key={category._id}
                  to={`/${slugify(category.name)}-${category._id}/${slugify(relatedSubCategory.name)}-${relatedSubCategory._id}`}
                  className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-100">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                      />
                    </div>

                    <h3 className="mt-3 text-center text-sm font-medium text-gray-700">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Wise Products */}
      <div className="container mx-auto px-4 py-6">
        {categoryData?.map((category) => (
          <CategoryWiseShowProduct
            key={category._id}
            categoryId={category._id}
            categoryName={category.name}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
