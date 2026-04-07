import { Router } from "express";
import { checkAdmin, createAlbum, createSong, deleteAlbum, deleteSong, updateAlbum } from "../routes/admin.route.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute, requireAdmin);

router.get("/check", checkAdmin);

router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);

router.post("/albums", createAlbum);
router.put("/albums/:id", updateAlbum);
router.delete("/albums/:id", deleteAlbum);

export default router;
