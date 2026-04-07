import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import { clerkClient } from "@clerk/express";

export const getComments = async (req, res, next) => {
	try {
		const { targetId, targetType } = req.query;
		
		let filter = {};
		if (targetId) {
			if (targetType === "Song") {
				filter.songId = targetId;
			} else if (targetType === "Album") {
				filter.albumId = targetId;
			}
		}

		const comments = await Comment.find(filter)
			.populate("userId", "fullName imageUrl clerkId")
			.sort({ createdAt: -1 });

		res.json(comments);
	} catch (error) {
		console.log("Error in getComments", error);
		next(error);
	}
};

export const createComment = async (req, res, next) => {
	try {
		const { songId, albumId, content } = req.body;
		const clerkId = req.auth?.userId;

		if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

		const user = await User.findOne({ clerkId });
		if (!user) return res.status(404).json({ message: "User not found" });

		const comment = await Comment.create({ 
			userId: user._id, 
			songId: songId || null, 
			albumId: albumId || null, 
			content 
		});

		const populatedComment = await Comment.findById(comment._id).populate("userId", "fullName imageUrl clerkId");
		res.status(201).json(populatedComment);
	} catch (error) {
		console.log("Error in createComment", error);
		next(error);
	}
};

// MỚI: Tính năng Sửa bình luận (Chỉ dành cho chính chủ)
export const updateComment = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { content } = req.body;
		const clerkId = req.auth?.userId;

		const comment = await Comment.findById(id).populate("userId");
		if (!comment) return res.status(404).json({ message: "Comment not found" });

		// Kiểm tra quyền sở hữu
		if (comment.userId.clerkId !== clerkId) {
			return res.status(403).json({ message: "You can only edit your own comments" });
		}

		comment.content = content;
		await comment.save();

		const updatedComment = await Comment.findById(id).populate("userId", "fullName imageUrl clerkId");
		res.status(200).json(updatedComment);
	} catch (error) {
		console.log("Error in updateComment", error);
		next(error);
	}
};

export const deleteComment = async (req, res, next) => {
	try {
		const { id } = req.params;
		const clerkId = req.auth?.userId;

		const comment = await Comment.findById(id).populate("userId");
		if (!comment) return res.status(404).json({ message: "Comment not found" });

		// KIỂM TRA QUYỀN XÓA (Owner OR Admin)
		const currentUser = await clerkClient.users.getUser(clerkId);
		const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

		if (comment.userId.clerkId !== clerkId && !isAdmin) {
			return res.status(403).json({ message: "You are not allowed to delete this comment" });
		}

		await Comment.findByIdAndDelete(id);
		res.status(200).json({ message: "Comment deleted successfully" });
	} catch (error) {
		console.log("Error in deleteComment", error);
		next(error);
	}
};
