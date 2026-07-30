import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  LogOut,
  ExternalLink,
  MapPinCheck,
  ChartBarStacked,
  ChartColumnStacked,
  ArrowUpFromLine,
  ShoppingBasket,
  ListOrdered,
} from "lucide-react";
import axiosInstance from "../utils/axios";
import { logoutUser } from "../redux/userSlice";
import toast from "react-hot-toast";
import { clearCart } from "../redux/cartSlice";

function UserMenu() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axiosInstance.post("/user/logout");

      if (res.data.success) {
        dispatch(logoutUser());
        dispatch(clearCart());
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log("logout handler error", error);
    }
  };

  return (
    <div className="w-full">
      {/* USER INFO */}
      <div className="border-b border-gray-200 pb-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 flex h-11 w-11 items-center justify-center rounded-full text-lg font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="line-clamp-1 flex items-center gap-1 font-semibold text-gray-800">
                {user?.name}{" "}
                <span className="bg-primary-100 rounded-full p-1 text-[10px]">
                  {user?.role}
                </span>
              </p>
              <Link to={"/dashboard/profile"}>
                <ExternalLink size={17} />
              </Link>
            </div>
            <p className="line-clamp-1 text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* MENU LINKS */}
      <div className="flex flex-col">
        {user?.role === "ADMIN" && (
          <>
            <NavLink
              to={"/dashboard/category"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-primary-100 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <ChartColumnStacked size={18} />
              Category
            </NavLink>
            <NavLink
              to={"/dashboard/sub-category"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-primary-100 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <ChartBarStacked size={18} />
              Sub Category
            </NavLink>
            <NavLink
              to={"/dashboard/upload-product"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-primary-100 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <ArrowUpFromLine size={18} />
              Upload Product
            </NavLink>
            <NavLink
              to={"/dashboard/products"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-primary-100 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <ShoppingBasket size={18} />
              Products
            </NavLink>
          </>
        )}

        <>
          <NavLink
            to={"/dashboard/orders"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-primary-100 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <ListOrdered size={18} />
            My Orders
          </NavLink>
          <NavLink
            to={"/dashboard/address"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-primary-100 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <MapPinCheck size={18} />
            Saved Address
          </NavLink>
        </>
      </div>

      {/* LOGOUT */}
      <div className="border-t border-gray-200 pt-2">
        <button
          onClick={logoutHandler}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserMenu;
