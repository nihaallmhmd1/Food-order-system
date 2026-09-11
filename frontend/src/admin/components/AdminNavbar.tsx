import { useEffect, useState } from "react";
import { getRestaurantById } from "../../api/restaurantApi";
import { useAuth } from "../../context/AuthContext";

function AdminNavbar() {
  const { user, logout } = useAuth();
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const roleName = typeof user?.role === "object" ? user.role.name : user?.role;
  const assignedRestaurant = user?.restaurantId;
  const restaurantId =
    assignedRestaurant && typeof assignedRestaurant === "object"
      ? assignedRestaurant._id
      : assignedRestaurant;

  useEffect(() => {
    if (roleName !== "restaurantadmin" || !restaurantId) {
      return;
    }

    getRestaurantById(restaurantId)
      .then((restaurant) => setRestaurantName(restaurant.name))
      .catch(() => setRestaurantName(null));
  }, [restaurantId, roleName]);

  const copyRestaurantId = async () => {
    if (!restaurantId) return;

    await navigator.clipboard.writeText(restaurantId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-16 border-b border-gray-200 bg-white md:left-64">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
            {roleName === "restaurantadmin"
              ? restaurantName || "Restaurant"
              : "Admin Panel"}
          </h2>
          {roleName === "restaurantadmin" && restaurantId && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>ID: {restaurantId}</span>
              <button
                type="button"
                onClick={copyRestaurantId}
                aria-label={copied ? "Restaurant ID copied" : "Copy restaurant ID"}
                title={copied ? "Copied" : "Copy restaurant ID"}
                className="rounded p-0.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                {copied ? "✓" : "⧉"}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-gray-800">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500">
              {(typeof user?.role === "object" ? user.role.name : user?.role) || "Administrator"}
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