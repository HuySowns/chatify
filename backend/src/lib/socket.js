import { Server } from "socket.io";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js"; // Bổ sung
import { Notification } from "../models/notification.model.js"; // Bổ sung

export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: "http://localhost:3000",
			credentials: true,
		},
	});

	const userSockets = new Map(); // { userId: socketId}
	const userActivities = new Map(); // {userId: activity}

	io.on("connection", (socket) => {
		socket.on("user_connected", (userId) => {
			userSockets.set(userId, socket.id);
			userActivities.set(userId, "Idle");
			io.emit("user_connected", userId);
			socket.emit("users_online", Array.from(userSockets.keys()));
			io.emit("activities", Array.from(userActivities.entries()));
		});

		socket.on("update_activity", ({ userId, activity }) => {
			userActivities.set(userId, activity);
			io.emit("activity_updated", { userId, activity });
		});

		// CHỈNH SỬA: Xử lý gửi tin nhắn và TẠO THÔNG BÁO Real-time
		socket.on("send_message", async (data) => {
			try {
				const { senderId, receiverId, content } = data;

				// 1. Lưu tin nhắn vào DB
				const message = await Message.create({ senderId, receiverId, content });

				// 2. Tìm thông tin người gửi để làm thông báo
				const sender = await User.findById(senderId);

				// 3. Tạo Thông báo trong DB cho người nhận
				const notification = await Notification.create({
					userId: receiverId,
					message: `You have a new message from ${sender?.fullName || "someone"}: "${content.substring(0, 30)}..."`,
					type: "message",
					relatedId: message._id,
				});

				// 4. Gửi tin nhắn Real-time nếu người nhận online
				const receiverSocketId = userSockets.get(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("receive_message", message);
					
					// GỬI THÔNG BÁO Real-time (Để hiển thị pop-up hoặc chấm đỏ)
					io.to(receiverSocketId).emit("new_notification", notification);
				}

				socket.emit("message_sent", message);
			} catch (error) {
				console.error("Message error:", error);
				socket.emit("message_error", error.message);
			}
		});

		socket.on("disconnect", () => {
			let disconnectedUserId;
			for (const [userId, socketId] of userSockets.entries()) {
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
			}
			if (disconnectedUserId) {
				io.emit("user_disconnected", disconnectedUserId);
			}
		});
	});
};
