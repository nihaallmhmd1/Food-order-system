import { useAuth } from "../../context/AuthContext";

function AdminNavbar() {
  const { user } = useAuth();

  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Admin Panel
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">
              {user?.name || "Admin"}
            </p>

            <p className="text-xs text-gray-500">
              {user?.role || "Administrator"}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;