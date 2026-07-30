import { Loader2, TriangleAlert, X } from "lucide-react";
import { useState } from "react";

function DeleteConfirmModel({ close, title, subtitle, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDelete();
      close();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2 text-red-500">
              <TriangleAlert size={22} />
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              Delete Confirmation
            </h2>
          </div>

          <button
            onClick={close}
            className="cursor-pointer rounded-full p-2 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-3 p-5">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>

        {/* BUTTONS */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 p-5">
          <button
            onClick={close}
            className="cursor-pointer rounded-xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="cursor-pointer rounded-xl bg-red-500 px-5 py-2.5 font-medium text-white transition hover:bg-red-600"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModel;
