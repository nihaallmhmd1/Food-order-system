import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import AdminBottomNav from "./AdminBottomNav";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <AdminNavbar />

      <main className="pb-20 pt-16 md:ml-64 md:pb-0">
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>

      <AdminBottomNav />
    </div>
  );
}

export default AdminLayout;