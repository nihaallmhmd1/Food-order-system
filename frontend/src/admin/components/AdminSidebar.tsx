import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminSidebar() {
  const { logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "📊",
    },  
    {
      name: "Restaurants",
      path: "/admin/restaurants",
      icon: "🍽️",
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: "📂",
    },
    {
      name: "Food Items",
      path: "/admin/food-items",
      icon: "🍔",
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: "🛒",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "👥",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-gray-200 bg-white md:flex">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <h1 className="text-2xl font-bold text-emerald-600">Foodie</h1>
        <span className="ml-2 rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
          ADMIN
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;