import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { getStats } from "../routes/stat.route.js";

const router = Router();

router.get("/", protectRoute, requireAdmin, getStats);

export default router;
