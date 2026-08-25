import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const getDisplayName = () => {
    if (!user) return "";
    if (user.name) return user.name;
    if (user.email) return user.email.split("@")[0];
    return "User";
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 pointer-events-none">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <nav className="pointer-events-auto relative flex items-center justify-between rounded-full bg-white/80 px-6 py-3 shadow-xl backdrop-blur-md transition-all duration-300 hover:bg-white/95">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-gray-900 transition-transform duration-300 hover:scale-105"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs text-white shadow-sm">
              🍔
            </span>
            Foodie
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-6 text-sm font-semibold text-gray-700 md:flex">
            {!isHomePage && (
              <Link
                to="/"
                className="transition-colors duration-200 hover:text-emerald-600 active:scale-95"
              >
                Home
              </Link>
            )}
            <Link
              to="/restaurants"
              className="transition-colors duration-200 hover:text-emerald-600 active:scale-95"
            >
              Restaurants
            </Link>
            <Link
              to="/orders"
              className="transition-colors duration-200 hover:text-emerald-600 active:scale-95"
            >
              Orders
            </Link>
            <Link
              to="/contact"
              className="transition-colors duration-200 hover:text-emerald-600 active:scale-95"
            >
              Contact
            </Link>
          </div>

          {/* Right Action: Cart & Auth State */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/cart"
              aria-label="View Cart"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-700 transition-colors hover:bg-emerald-100 hover:text-emerald-700"
            >
              🛒
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-800">
                  {getDisplayName()}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-stone-200 px-4 py-1.5 text-xs font-semibold text-gray-800 transition-all duration-300 hover:bg-red-500 hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-emerald-600 hover:shadow-emerald-600/30 active:scale-95"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-gray-700 hover:bg-stone-200 md:hidden"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="absolute left-0 right-0 top-16 z-50 mx-4 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-2xl backdrop-blur-xl md:hidden">
              {!isHomePage && (
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold text-gray-800 hover:text-emerald-600"
                >
                  Home
                </Link>
              )}
              <Link
                to="/restaurants"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-semibold text-gray-800 hover:text-emerald-600"
              >
                Restaurants
              </Link>
              <Link
                to="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-semibold text-gray-800 hover:text-emerald-600"
              >
                Orders
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-semibold text-gray-800 hover:text-emerald-600"
              >
                Contact
              </Link>

              <hr className="border-gray-100" />

              <div className="flex items-center justify-between">
                <Link
                  to="/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  🛒 Cart
                </Link>

                {user ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-800">
                      {getDisplayName()}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="rounded-full bg-red-500 px-4 py-1 text-xs font-semibold text-white"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-md"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}