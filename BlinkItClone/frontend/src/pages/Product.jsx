const Product = () => {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500">Manage all your products</p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="rounded-2xl bg-white shadow">
        <div className="border-b border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700">Product List</h2>
        </div>

        {/* EMPTY STATE */}
        <div className="flex min-h-100 items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              No Products Found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Products will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Product;
