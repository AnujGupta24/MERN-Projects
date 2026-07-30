import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border border-t-gray-300">
      {/* Top Section */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-13 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-green-600">Blinkit Clone</h2>

          <p className="mt-4 text-sm leading-6 text-gray-600">
            Delivering groceries, essentials, and daily needs at your doorstep
            in minutes. Fast, reliable, and seamless shopping experience.
          </p>

          {/* App Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <button className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-3 transition hover:bg-gray-100">
              <FaGooglePlay className="text-2xl" />
              <div className="text-left">
                <p className="text-xs text-gray-500">GET IT ON</p>
                <p className="text-sm font-semibold">Google Play</p>
              </div>
            </button>

            <button className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-3 transition hover:bg-gray-100">
              <FaApple className="text-2xl" />
              <div className="text-left">
                <p className="text-xs text-gray-500">Download on the</p>
                <p className="text-sm font-semibold">App Store</p>
              </div>
            </button>
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Useful Links</h3>

          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li>
              <Link to="/" className="transition hover:text-green-600">
                Home
              </Link>
            </li>

            <li>
              <Link to="" className="transition hover:text-green-600">
                Products
              </Link>
            </li>

            <li>
              <Link to="" className="transition hover:text-green-600">
                Categories
              </Link>
            </li>

            <li>
              <Link to="" className="transition hover:text-green-600">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Categories</h3>

          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li className="hover:text-green-600">Vegetables & Fruits</li>
            <li className="hover:text-green-600">Dairy & Breakfast</li>
            <li className="hover:text-green-600">Cold Drinks & Juices</li>
            <li className="hover:text-green-600">Bakery & Biscuits</li>
            <li className="hover:text-green-600">Snacks & Munchies</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Contact</h3>

          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <p>Mumbai, Maharashtra, India</p>
            <p>support@blinkitclone.com</p>
            <p>+91 98765 43210</p>
          </div>

          {/* Social Icons */}
          <div className="mt-6 flex gap-4">
            <Link
              to="https://github.com/"
              className="rounded-full bg-gray-100 p-3 text-xl text-gray-700 transition hover:bg-black hover:text-white"
            >
              <FaGithub />
            </Link>

            <Link
              to="https://linkedin.com/"
              className="rounded-full bg-gray-100 p-3 text-xl text-blue-700 transition hover:bg-blue-700 hover:text-white"
            >
              <FaLinkedin />
            </Link>

            <Link
              to="https://twitter.com/"
              className="rounded-full bg-gray-100 p-3 text-xl text-sky-500 transition hover:bg-sky-500 hover:text-white"
            >
              <FaTwitter />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-5 text-sm text-gray-600 md:flex-row">
          <p>© {year} All rights reserved to Anuj.</p>

          <p>Built with MERN Stack & Redux Toolkit</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
