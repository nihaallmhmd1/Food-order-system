import { Router } from "express";
import { createRole, deleteRole, getAllRoles, updateRole } from "../controllers/roleController";
import { authenticate, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticate, requireAdmin);
router.get("/", getAllRoles);
router.post("/", createRole);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);

export default router;