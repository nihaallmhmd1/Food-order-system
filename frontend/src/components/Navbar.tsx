import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();
  if (location.pathname === "/cart") {
    return null;
  }
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-tight text-orange-500"
        >
          Foodie
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 md:flex">
          <Link
            to="/"
            className={`text-[17px] font-semibold transition ${
              isActive("/")
                ? "text-gray-900"
                : "text-gray-700 hover:text-orange-500"
            }`}
          >
            Home
          </Link>

          <Link
            to="/restaurants"
            className={`text-[17px] font-semibold transition ${
              isActive("/restaurants")
                ? "text-gray-900"
                : "text-gray-700 hover:text-orange-500"
            }`}
          >
            Restaurants
          </Link>

          <Link
            to="/orders"
            className={`text-[17px] font-semibold transition ${
              isActive("/orders")
                ? "text-gray-900"
                : "text-gray-700 hover:text-orange-500"
            }`}
          >
            Orders
          </Link>
        </nav>

        {/* Desktop Cart */}
        <Link
          to="/cart"
          className="hidden items-center gap-3 rounded-full bg-orange-500 px-7 py-3 text-[16px] font-bold text-white shadow-sm transition hover:bg-orange-600 md:flex"
        >
          {/* Cart Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="20" r="1" />
            <circle cx="19" cy="20" r="1" />
            <path d="M3 4h2l2.4 11.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
          </svg>

          Cart

          {cartCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-orange-500">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-5 shadow-sm md:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`rounded-lg px-4 py-3 font-semibold ${
                isActive("/")
                  ? "bg-orange-50 text-orange-500"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>

            <Link
              to="/restaurants"
              onClick={() => setMenuOpen(false)}
              className={`rounded-lg px-4 py-3 font-semibold ${
                isActive("/restaurants")
                  ? "bg-orange-50 text-orange-500"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Restaurants
            </Link>

            <Link
              to="/orders"
              onClick={() => setMenuOpen(false)}
              className={`rounded-lg px-4 py-3 font-semibold ${
                isActive("/orders")
                  ? "bg-orange-50 text-orange-500"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Orders
            </Link>

            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-3 rounded-full bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="20" r="1" />
                <circle cx="19" cy="20" r="1" />
                <path d="M3 4h2l2.4 11.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
              </svg>

              Cart

              {cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs text-orange-500">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;