import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController";
import { authenticate, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/stats", authenticate, requireAdmin, getDashboardStats);

export default router;