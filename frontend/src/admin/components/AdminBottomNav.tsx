import { NavLink } from "react-router-dom";

function AdminBottomNav() {
  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Restaurants", path: "/admin/restaurants", icon: "🍽️" },
    { name: "Categories", path: "/admin/categories", icon: "📂" },
    { name: "Food Items", path: "/admin/food-items", icon: "🍔" },
    { name: "Orders", path: "/admin/orders", icon: "🛒" },
    { name: "Users", path: "/admin/users", icon: "👥" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 overflow-x-auto border-t border-gray-200 bg-white md:hidden">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/admin"}
          className={({ isActive }) =>
            `flex min-w-[64px] flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition ${
              isActive ? "text-emerald-600" : "text-gray-500"
            }`
          }
        >
          <span className="text-lg leading-none">{item.icon}</span>
          <span className="whitespace-nowrap">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default AdminBottomNav;