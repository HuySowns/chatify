import { Router } from "express";
import { getGenres, createGenre, deleteGenre } from "../routes/genre.route.js";

const router = Router();

router.get("/", getGenres);
router.post("/", createGenre);
router.delete("/:id", deleteGenre);

export default router;
