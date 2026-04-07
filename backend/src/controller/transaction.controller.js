import { Router } from "express";
import { getTransactions, createTransaction, deleteTransaction, getAllTransactions } from "../routes/transaction.route.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Route của người dùng thường
router.get("/", protectRoute, getTransactions);
router.post("/", protectRoute, createTransaction);

// Route dành riêng cho Admin
router.get("/all", protectRoute, requireAdmin, getAllTransactions);
router.delete("/:id", protectRoute, requireAdmin, deleteTransaction);

export default router;

