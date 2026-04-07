import { Router } from "express";
import { checkAdmin, createAlbum, createSong, deleteAlbum, deleteSong, updateAlbum, updateSong } from "../routes/admin.route.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Toàn bộ các route admin đều phải được bảo vệ bởi protectRoute và requireAdmin
router.use(protectRoute, requireAdmin);

// Kiểm tra quyền Admin
router.get("/check", checkAdmin);

// QUẢN LÝ BÀI HÁT (SONGS)
router.post("/songs", createSong);
router.put("/songs/:id", updateSong); // MỚI: Chỉnh sửa bài hát
router.delete("/songs/:id", deleteSong);

// QUẢN LÝ ALBUM
router.post("/albums", createAlbum);
router.put("/albums/:id", updateAlbum);
router.delete("/albums/:id", deleteAlbum);

export default router;
