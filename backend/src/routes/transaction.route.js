import { Transaction } from "../models/transaction.model.js";
import { User } from "../models/user.model.js";

/**
 * @desc Get all transactions for the authenticated user
 * @route GET /api/transactions
 */
export const getTransactions = async (req, res, next) => {
	try {
		const clerkId = req.auth?.userId;
		if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

		const user = await User.findOne({ clerkId });
		if (!user) return res.status(404).json({ message: "User not found" });

		const transactions = await Transaction.find({ userId: user._id });
		res.json(transactions);
	} catch (error) {
		next(error);
	}
};

/**
 * @desc Create a new transaction (Upgrade to Premium)
 * @route POST /api/transactions
 */
export const createTransaction = async (req, res, next) => {
	try {
		const { amount, description } = req.body;
		const clerkId = req.auth?.userId;

		if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

		// 1. Tìm User trong MongoDB tương ứng với Clerk ID
		const user = await User.findOne({ clerkId });
		if (!user) return res.status(404).json({ message: "User not found" });

		// 2. Tạo Transaction với userId (ObjectId) của MongoDB
		const transaction = await Transaction.create({
			amount,
			description,
			userId: user._id,
			status: "completed", // Tự động hoàn thành giao dịch trong demo này
		});

		// 3. Nâng cấp tài khoản User lên Premium
		user.isPremium = true;
		await user.save();

		res.status(201).json(transaction);
	} catch (error) {
		next(error);
	}
};


/**
 * @desc Get all transactions (Admin only)
 * @route GET /api/transactions/all
 */
export const getAllTransactions = async (req, res, next) => {
	try {
		// Tìm tất cả giao dịch và "join" (populate) với bảng User để lấy tên/ảnh
		const transactions = await Transaction.find()
			.populate("userId", "fullName imageUrl clerkId")
			.sort({ createdAt: -1 });

		res.json(transactions);
	} catch (error) {
		console.log("Error in getAllTransactions", error);
		next(error);
	}
};

export const deleteTransaction = async (req, res, next) => {
	try {
		await Transaction.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Transaction deleted" });
	} catch (error) {
		next(error);
	}
};


