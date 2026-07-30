const ProductDetailsSkeleton = () => {
  return (
    <div className="container mx-auto min-h-screen p-4">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-112.5 animate-pulse rounded-xl bg-gray-200"></div>

          <div className="flex gap-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 w-24 animate-pulse rounded-lg bg-gray-200"
              ></div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200"></div>
          <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200"></div>
          <div className="h-28 animate-pulse rounded bg-gray-200"></div>
          <div className="h-14 w-40 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetailsSkeleton;
