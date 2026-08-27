import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    navigate(trimmed ? `/restaurants?search=${encodeURIComponent(trimmed)}` : "/restaurants");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white px-6 py-3.5 shadow-xs lg:px-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white shadow-xs">
            🍔
          </div>
          <span className="text-xl font-bold tracking-tight text-emerald-900">
            Foodie
          </span>
        </Link>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
          <div className="flex items-center w-full rounded-xl bg-gray-100 px-3.5 py-2 focus-within:ring-2 focus-within:ring-emerald-600 focus-within:bg-white border border-transparent focus-within:border-emerald-600">
            <span className="mr-2 text-sm text-gray-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search restaurants or cuisines..."
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
            />
          </div>
        </form>

        {/* Navigation Right Actions */}
        <div className="flex items-center gap-5 shrink-0">
          <Link
            to="/restaurants"
            className="hidden text-sm font-medium text-gray-600 hover:text-emerald-700 sm:block"
          >
            Restaurants
          </Link>
          <Link
            to="/orders"
            className="hidden text-sm font-medium text-gray-600 hover:text-emerald-700 sm:block"
          >
            Orders
          </Link>
          <Link
            to="/cart"
            aria-label="View Cart"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
          >
            🛒
          </Link>
          <UserMenu variant="dark" />
        </div>
      </div>
    </header>
  );
}
