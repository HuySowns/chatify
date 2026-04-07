import { Router } from "express";
import { getComments, createComment, deleteComment, updateComment } from "../routes/comment.route.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

// Lấy danh sách bình luận (Công khai)
router.get("/", getComments);

// Gửi bình luận (Yêu cầu đăng nhập)
router.post("/", protectRoute, createComment);

// CHỈNH SỬA BÌNH LUẬN (MỚI: Yêu cầu đăng nhập)
router.put("/:id", protectRoute, updateComment);

// Xóa bình luận (Yêu cầu đăng nhập)
router.delete("/:id", protectRoute, deleteComment);

export default router;
