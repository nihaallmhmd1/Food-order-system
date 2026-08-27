import { useAuth } from "../../context/AuthContext";

function AdminNavbar() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-16 border-b border-gray-200 bg-white md:left-64">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
          Admin Panel
        </h2>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-gray-800">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500">
              {user?.role || "Administrator"}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700 sm:h-10 sm:w-10">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>

          <button
            onClick={logout}
            aria-label="Logout"
            className="flex h-9 w-9 items-center justify-center rounded-full text-red-600 hover:bg-red-50 md:hidden"
          >
            🚪
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;