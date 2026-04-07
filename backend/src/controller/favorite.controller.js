import { Router } from "express";
import { getFavorites, createFavorite, deleteFavorite } from "../routes/favorite.route.js";

const router = Router();

router.get("/", getFavorites);
router.post("/", createFavorite);
router.delete("/:id", deleteFavorite);

export default router;
