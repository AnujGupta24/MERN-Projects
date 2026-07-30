import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../utils/axios";
import CategoryCard from "../components/CategoryCard";
import Skeleton from "../components/Skeleton";
import NoData from "../components/NoData";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);

  const fetchSearchProducts = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/product/search-products?q=${query}`,
      );

      setProducts(res.data.data.products);
    } catch (error) {
      console.log("fetch search product error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (query?.trim()) {
        fetchSearchProducts();
      } else {
        setProducts([]);
      }
    }, 500);

    return () => {
      clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="mb-10 p-4">
      {products.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold">
            Search Results for "{query}"
          </h2>
          <p className="mb-6 text-xl font-semibold text-gray-600">
            Total products: {products.length}
          </p>
        </>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {Array(10)
            .fill(null)
            .map((_, index) => (
              <Skeleton key={index} />
            ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 gap-15 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <CategoryCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-500">
          {query?.trim() ? <NoData /> : "Search for the products you like"}
        </div>
      )}
    </div>
  );
}
export default SearchPage;
