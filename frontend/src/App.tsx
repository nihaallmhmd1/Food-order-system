import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

import AdminRoutes from "./admin/routes/AdminRoutes";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminRestaurants from "./admin/pages/AdminRestaurants";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminFoodItems from "./admin/pages/AdminFoodItems";
import AdminCategories from "./admin/pages/AdminCategories";

function MainLayout() {
  const location = useLocation();

  // Hide customer navbar on Home, Restaurants and Admin pages
  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/restaurants" ||
    location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-white">
      {!hideNavbar && <Navbar />}

      <main>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/restaurants" element={<Restaurants />} />

          <Route
            path="/restaurants/:id"
            element={<RestaurantDetails />}
          />

          <Route path="/cart" element={<Cart />} />

          <Route path="/orders" element={<Orders />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route
            path="/order-confirmation"
            element={<OrderConfirmation />}
          />

          {/* Admin Routes */}
          <Route element={<AdminRoutes />}>

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/restaurants" element={<AdminRestaurants />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/food-items" element={<AdminFoodItems />} />
            <Route path="/admin/categories" element={<AdminCategories />} />

          </Route>
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

export default App;