import { Router } from "express";
import { getAllSongs, getSongById, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs, streamSong } from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, requireAdmin, getAllSongs);
router.get("/by-id/:id", protectRoute, getSongById);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/stream/:id", streamSong); // No protectRoute here - audio tag needs to access this

export default router;
