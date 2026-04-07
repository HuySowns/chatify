import { Router } from "express";
import { getGenres, createGenre, deleteGenre, updateGenre } from "../routes/genre.route.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Lấy danh sách thể loại (Công khai cho tất cả người dùng)
router.get("/", getGenres);

// QUẢN TRỊ VIÊN: Thêm, Xóa, Sửa thể loại nhạc
// Yêu cầu đăng nhập & quyền Admin (Kiểm tra email Admin)
router.post("/", protectRoute, requireAdmin, createGenre);
router.put("/:id", protectRoute, requireAdmin, updateGenre);
router.delete("/:id", protectRoute, requireAdmin, deleteGenre);

export default router;
