import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import restaurantRoutes from "./routes/restaurantRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import foodItemRoutes from "./routes/foodItemRoutes";
import orderRoutes from "./routes/orderRoutes";
import authRoutes from "./routes/authRoutes";
import searchRoutes from "./routes/searchRoutes";
import userRoutes from "./routes/userRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import roleRoutes from "./routes/roleRoutes";

const app = express();

app.disable("etag");

app.use(cookieParser());

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Food Ordering API is running",
  });
});

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/food-items", foodItemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/roles", roleRoutes);

export default app;