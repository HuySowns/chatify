import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

export const getNotifications = async (req, res, next) => {
	try {
		const clerkId = req.auth?.userId;
		if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

		const user = await User.findOne({ clerkId });
		if (!user) return res.status(404).json({ message: "User not found" });

		// Tải danh sách thông báo của người dùng hiện tại
		const notifications = await Notification.find({ userId: user._id })
			.sort({ createdAt: -1 })
			.limit(50); // Giới hạn cho hiệu năng

		res.json(notifications);
	} catch (error) {
		console.log("Error in getNotifications", error);
		next(error);
	}
};

export const createNotification = async (req, res, next) => {
	try {
		const { message, type, relatedId, targetUserId } = req.body;
		
		// Sử dụng targetUserId (MongoDB _id) nếu được cung cấp, nếu không thì dùng người dùng hiện tại
		const notification = await Notification.create({ 
			userId: targetUserId, 
			message, 
			type, 
			relatedId 
		});
		
		res.status(201).json(notification);
	} catch (error) {
		console.log("Error in createNotification", error);
		next(error);
	}
};

// MỚI: Đánh dấu đã đọc một thông báo
export const markNotificationAsRead = async (req, res, next) => {
	try {
		const { id } = req.params;
		const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
		
		if (!notification) return res.status(404).json({ message: "Notification not found" });
		res.json(notification);
	} catch (error) {
		console.log("Error in markNotificationAsRead", error);
		next(error);
	}
};

// MỚI: Xóa tất cả thông báo của người dùng hiện tại
export const clearNotifications = async (req, res, next) => {
	try {
		const clerkId = req.auth?.userId;
		const user = await User.findOne({ clerkId });
		if (!user) return res.status(404).json({ message: "User not found" });

		await Notification.deleteMany({ userId: user._id });
		res.status(200).json({ message: "All notifications cleared" });
	} catch (error) {
		console.log("Error in clearNotifications", error);
		next(error);
	}
};

export const deleteNotification = async (req, res, next) => {
	try {
		await Notification.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Notification deleted" });
	} catch (error) {
		next(error);
	}
};
