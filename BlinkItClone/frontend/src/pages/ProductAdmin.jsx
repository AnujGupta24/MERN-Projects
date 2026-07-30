import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { PackageSearch, Search } from "lucide-react";
import ProductCardAdmin from "../components/ProductCardAdmin";
import toast from "react-hot-toast";
import UpdateProductAdminModel from "../components/UpdateProductAdminModel";
import DeleteConfirmModel from "../components/DeleteConfirmModel";

function ProductAdmin() {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [loading, setLoading] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/product/all-products", {
        params: {
          page,
          limit,
          search,
        },
      });
      // console.log("FETCH PRODUCT DATA", res.data);

      if (res.data.success) {
        setProductData(res.data.data.products);
        setTotalPages(res.data.data.totalPages);
        setTotalProducts(res.data.data.totalProducts);
      }
    } catch (error) {
      console.log("FETCH PRODUCT DATA ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // debounce
    const timer = setTimeout(() => {
      fetchProductData();
    }, 500);

    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search]);

  const editProductHandler = (product) => {
    setSelectedProduct(product);
    setOpenEditModal(true);
  };

  const openDeleteHandler = (id) => {
    setDeleteProductId(id);
    setOpenDeleteModal(true);
  };

  const deleteProductHandler = async (productId) => {
    try {
      const res = await axiosInstance.delete(
        `/product/delete-product/${productId}`,
      );
      // console.log("delete product response", res.data);

      if (res.data.success) {
        toast.success(res.data.message);
        
        fetchProductData();
      }
    } catch (error) {
      console.log("DELETE ADMIN PRODUCT HANDLER ERROR", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Products</h1>
          <p className="text-sm text-gray-500">Manage all your products here</p>
        </div>
      </div>

      {/* CARD  */}
      <div className="rounded-2xl bg-white">
        {/* top bar */}
        <div className="flex items-center gap-4 border-b border-gray-300 pb-5">
          {/* search  */}
          <div className="flex w-sm items-center justify-center rounded-xl border border-gray-300">
            <Search size={18} className="ml-2 text-gray-500" />
            <input
              type="text"
              placeholder="search products...."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="focus:border-primary-200 w-full px-2 py-3 outline-none md:max-w-sm"
            />
          </div>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="focus:border-primary-200 rounded-xl border border-gray-300 px-4 py-3 outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* EMPTY STATE */}
        {loading ? (
          <div className="flex min-h-100 items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : productData.length === 0 ? (
          <div className="flex min-h-100 items-center justify-center">
            <div className="text-center">
              <PackageSearch size={55} className="mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg font-semibold text-gray-700">
                No Products Found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Products will appear here
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-hidden">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <>
                  {productData.map((product) => (
                    <ProductCardAdmin
                      key={product._id}
                      product={product}
                      onEdit={editProductHandler}
                      onDelete={openDeleteHandler}
                    />
                  ))}
                </>
              </div>
            </div>

            {/* pagination */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-300 p-5 md:flex-row">
              <p className="text-sm text-gray-500">
                Total Products: {totalProducts}
              </p>

              <div className="flex items-center gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="rounded-xl border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="text-sm font-medium">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => {
                    if (page === totalPages) {
                      setPage(1);
                    } else {
                      setPage((prev) => prev + 1);
                    }
                  }}
                  className="cursor-pointer rounded-xl border px-4 py-2"
                >
                  {page === totalPages ? "Go Back To 1" : "Next"}
                </button>
              </div>
            </div>

            {openEditModal && (
              <UpdateProductAdminModel
                product={selectedProduct}
                close={() => {
                  setOpenEditModal(false);
                  setSelectedProduct(null);
                }}
                fetchProducts={fetchProductData}
              />
            )}

            {openDeleteModal && (
              <DeleteConfirmModel
                title="Delete Product?"
                subtitle="This action cannot be undone."
                close={() => {
                  setOpenDeleteModal(false);
                  setDeleteProductId(null);
                }}
                onDelete={() => deleteProductHandler(deleteProductId)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductAdmin;
