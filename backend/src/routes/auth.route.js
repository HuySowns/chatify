import { User } from "../models/user.model.js";
import { Transaction } from "../models/transaction.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
	try {
		const { fullName, email, password } = req.body;
		if (!fullName || !email || !password) {
			return res.status(400).json({ message: "Tất cả các trường là bắt buộc" });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = await User.create({
			fullName,
			email,
			password: hashedPassword,
		});

		const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || "secret_key_123", { expiresIn: "7d" });

		res.status(201).json({ success: true, token, user: newUser });
	} catch (error) {
		console.log("Error in signup", error);
		next(error);
	}
};

export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: "Tài khoản hoặc mật khẩu không đúng" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ message: "Tài khoản hoặc mật khẩu không đúng" });

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret_key_123", { expiresIn: "7d" });
		res.status(200).json({ success: true, token, user });
	} catch (error) {
		console.log("Error in login", error);
		next(error);
	}
};

export const authCallback = async (req, res, next) => {
	try {
		const { id, firstName, lastName, imageUrl } = req.body;

		// check if user already exists
		let user = await User.findOne({ clerkId: id });

		if (!user) {
			// signup
			user = await User.create({
				clerkId: id,
				fullName: `${firstName || ""} ${lastName || ""}`.trim(),
				imageUrl,
			});
		} else {
			// KIỂM TRA TÍNH HỢP LỆ CỦA PREMIUM (Fix theo yêu cầu của bạn)
			// Nếu User có cờ isPremium=true, ta phải check xem có ít nhất 1 giao dịch thành công không
			if (user.isPremium) {
				const hasTransaction = await Transaction.findOne({ userId: user._id, status: "completed" });
				if (!hasTransaction) {
					console.log(`Resetting premium for user ${user.fullName} due to missing transaction.`);
					user.isPremium = false;
					await user.save();
				}
			}
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in auth callback", error);
		next(error);
	}
};
