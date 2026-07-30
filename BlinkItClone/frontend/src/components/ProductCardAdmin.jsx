import { PenSquare, Trash2 } from "lucide-react";

function ProductCardAdmin({ product, onDelete, onEdit }) {
  return (
    <div className="my-2.5 overflow-hidden rounded-3xl border border-gray-200 transition hover:-translate-y-1">
      {/* IMAGE */}
      <div className="relative">
        <img
          src={product.image[0]}
          alt={product.name}
          className="h-56 w-full object-cover"
        />

        {/* STOCK BADGE */}
        <div className="absolute top-3 right-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              product.stock > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {product.stock > 0 ? "In Stock" : "Out Of Stock"}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex min-h-62.5 flex-col justify-between p-5">
        <div className="space-y-4">
          {/* TITLE */}
          <div>
            <h2 className="line-clamp-1 text-lg font-semibold text-gray-800">
              {product.name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {product.category?.name}
            </p>
          </div>

          {/* PRICE */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{product.price}
              </p>

              <p className="text-sm text-gray-500">{product.unit} units</p>
            </div>

            {product.discount > 0 && (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* DESCRIPTION */}
          <p className="line-clamp-3 text-sm text-gray-500">
            {product.description}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => onEdit(product)}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-50 py-3 font-medium text-blue-600 transition hover:bg-blue-100"
          >
            <PenSquare size={18} />
          </button>

          <button
            onClick={() => onDelete(product._id)}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-red-50 py-3 font-medium text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProductCardAdmin;
