import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

export const getAllUsers = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const users = await User.find({ clerkId: { $ne: currentUserId } });
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

export const getMessages = async (req, res, next) => {
	try {
		const myId = req.auth.userId;
		const { userId } = req.params;

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};

export const updatePlaybackPosition = async (req, res, next) => {
	try {
		const userId = req.auth.userId;
		const { currentSongId, currentPlaybackTime } = req.body;

		if (currentSongId === null) {
			// Nếu không có bài hát nào, xóa thông tin playback
			await User.findOneAndUpdate(
				{ clerkId: userId },
				{
					currentSongId: null,
					currentPlaybackTime: 0,
				},
				{ new: true }
			);
		} else {
			await User.findOneAndUpdate(
				{ clerkId: userId },
				{
					currentSongId,
					currentPlaybackTime,
				},
				{ new: true }
			);
		}

		res.status(200).json({ success: true });
	} catch (error) {
		next(error);
	}
};

export const getPlaybackPosition = async (req, res, next) => {
	try {
		const userId = req.auth.userId;
		const user = await User.findOne({ clerkId: userId });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({
			currentSongId: user.currentSongId,
			currentPlaybackTime: user.currentPlaybackTime,
		});
	} catch (error) {
		next(error);
	}
};
