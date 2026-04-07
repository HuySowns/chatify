import { Router } from "express";
import { getNotifications, createNotification, deleteNotification, markNotificationAsRead, clearNotifications } from "../routes/notification.route.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

// Toàn bộ các route thông báo đều yêu cầu đăng nhập
router.use(protectRoute);

router.get("/", getNotifications);

// Đánh dấu đã đọc một thông báo
router.patch("/:id", markNotificationAsRead);

// Xóa tất cả thông báo
router.delete("/clear-all", clearNotifications);
router.delete("/:id", deleteNotification);

// Route dự phòng để tạo thông báo từ phía server (cần test tay nếu cần)
router.post("/", createNotification);

export default router;
