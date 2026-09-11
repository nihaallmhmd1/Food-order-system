import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../components/AdminLayout";

function AdminRoutes() {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Checking access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Extract role name safely handling populated object or string fallback
  const roleName =
    typeof user?.role === "object" && user?.role !== null
      ? (user.role as { name?: string }).name
      : user?.role;

  const permissions =
    typeof user?.role === "object" && user.role !== null
      ? user.role.permissions || []
      : [];
  const permissionByPath: Record<string, string> = {
    "/admin": "dashboard",
    "/admin/restaurants": "restaurants",
    "/admin/categories": "categories",
    "/admin/food-items": "food-items",
    "/admin/orders": "orders",
    "/admin/users": "users",
    "/admin/roles": "roles",
  };
  const requiredPermission = permissionByPath[location.pathname] || "dashboard";

  const restaurantId =
    typeof user?.restaurantId === "object" && user.restaurantId !== null
      ? user.restaurantId._id
      : user?.restaurantId;

  if (
    roleName === "customer" ||
    (roleName === "restaurantadmin" && !restaurantId) ||
    (roleName !== "admin" && !permissions.includes(requiredPermission))
  ) {
    return <Navigate to="/" replace />;
  }

  return <AdminLayout />;
}

export default AdminRoutes;