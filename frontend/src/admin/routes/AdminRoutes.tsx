import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminLayout from "../components/AdminLayout";

function AdminRoutes() {
  const { user, loading, isAuthenticated } = useAuth();

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

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <AdminLayout />;
}

export default AdminRoutes;