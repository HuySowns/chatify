import { Router } from "express";
import { getFollows, toggleFollow, deleteFollow } from "../routes/follow.route.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, getFollows);
router.post("/toggle", protectRoute, toggleFollow);
router.delete("/:id", protectRoute, deleteFollow);

export default router;

