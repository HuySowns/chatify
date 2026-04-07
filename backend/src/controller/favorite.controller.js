import { Router } from "express";
import { getFavorites, toggleFavorite, deleteFavorite } from "../routes/favorite.route.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, getFavorites);
router.post("/toggle", protectRoute, toggleFavorite);
router.delete("/:id", protectRoute, deleteFavorite);

export default router;

