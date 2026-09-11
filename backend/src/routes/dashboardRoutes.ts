import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController";
import { authenticate, requirePermission } from "../middleware/authMiddleware";

const router = Router();

router.get("/stats", authenticate, requirePermission("dashboard"), getDashboardStats);

export default router;