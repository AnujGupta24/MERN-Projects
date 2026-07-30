import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import Search from "./Search";
import { FaCartPlus, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import UserMenu from "./UserMenu";
import DisplayCartItems from "./DisplayCartItems";

function Header() {
  const user = useSelector((state) => state.user.user);
  const cartTotalItems = useSelector((state) => state.cart.cartItems);

  const location = useLocation();
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const [totalQty, setTotalQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [openCartSection, setOpenCartSection] = useState(false);

  // calc price and qty
  useEffect(() => {
    let qty = 0;
    let price = 0;

    cartTotalItems.forEach((item) => {
      qty += item.quantity;
      price += item.product.price * item.quantity;
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTotalQty(qty);
    setTotalPrice(price);
  }, [cartTotalItems]);

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenUserMenu(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-100 flex h-15 w-full items-center bg-white shadow-md">
      <div className="mx-auto flex min-w-6xl items-center justify-between px-5">
        <Link to={"/"} className="h-full">
          <img src={logo} width={150} height={50} alt="logo" />
        </Link>

        <Search />

        <div className="flex items-center lg:gap-2">
          <button className="cursor-pointer lg:hidden">
            <FaUser size={20} />
          </button>
          <div className="hidden cursor-pointer items-center lg:flex lg:gap-4">
            {user?._id ? (
              <div className="relative">
                <div
                  onClick={() => setOpenUserMenu((prev) => !prev)}
                  className="flex items-center select-none"
                >
                  <p>Account</p>
                  {openUserMenu ? <ChevronUp /> : <ChevronDown />}
                </div>
                {openUserMenu && (
                  <div className="absolute top-8 right-0 z-50">
                    <div className="min-w-52 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
                      <UserMenu close={handleCloseUserMenu} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to={"/login"} className="font-semibold">
                Login
              </Link>
            )}

            <button
              onClick={() => setOpenCartSection(true)}
              className="flex cursor-pointer items-center gap-3 rounded bg-green-700 px-3 py-2 text-white hover:bg-green-600"
            >
              <FaCartPlus className="animate-bounce" size={25} />
              <div>
                {cartTotalItems.length > 0 ? (
                  <div className="flex flex-col items-start">
                    <p className="font-semibold">{totalQty} items</p>
                    <p className="font-semibold">₹ {totalPrice}</p>
                  </div>
                ) : (
                  <p className="font-semibold">My Cart</p>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {openCartSection && (
        <DisplayCartItems close={() => setOpenCartSection(false)} />
      )}
    </header>
  );
}

export default Header;
