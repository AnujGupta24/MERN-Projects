const Skeleton = () => {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Product Image */}
      <div className="mx-auto h-32 w-28 rounded-lg bg-gray-200"></div>

      {/* Product Name */}
      <div className="mt-4 ml-2 h-4 w-3/4 rounded bg-gray-200"></div>
      <div className="mt-2 ml-2 h-3 w-1/2 rounded bg-gray-200"></div>

      {/* Price Section */}
      <div className="mt-4 ml-2 flex items-center gap-3">
        <div className="h-5 w-16 rounded bg-gray-200"></div>
        <div className="h-4 w-12 rounded bg-gray-200"></div>
        <div className="h-5 w-10 rounded-full bg-gray-200"></div>
      </div>

      {/* Add Button */}
      <div className="mt-5 flex h-10 w-25 justify-self-end rounded-lg bg-gray-200"></div>
    </div>
  );
};

export default Skeleton;
