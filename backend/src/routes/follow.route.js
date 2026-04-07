import { Follow } from "../models/follow.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js"; // Bổ sung

export const getFollows = async (req, res, next) => {
	try {
		const clerkId = req.auth?.userId;
		if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

		const user = await User.findOne({ clerkId });
		if (!user) return res.status(404).json({ message: "User not found" });

		const following = await Follow.find({ followerId: user._id }).populate("followingId", "fullName imageUrl");
		const followers = await Follow.find({ followingId: user._id }).populate("followerId", "fullName imageUrl");

		res.json({ following, followers });
	} catch (error) {
		next(error);
	}
};

export const toggleFollow = async (req, res, next) => {
	try {
		const { followingId } = req.body;
		const clerkId = req.auth?.userId;
		if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

		const follower = await User.findOne({ clerkId });
		if (!follower) return res.status(404).json({ message: "Follower not found" });

		if (follower._id.toString() === followingId) {
			return res.status(400).json({ message: "You cannot follow yourself" });
		}

		const existingFollow = await Follow.findOne({
			followerId: follower._id,
			followingId,
		});

		if (existingFollow) {
			// TRƯỜNG HỢP: UNFOLLOW
			await Follow.findByIdAndDelete(existingFollow._id);
			
			// Tạo thông báo Unfollow
			await Notification.create({
				userId: followingId, // Gửi đến người bị unfollow
				message: `${follower.fullName} has unfollowed you.`,
				type: "follow",
				relatedId: follower._id,
			});

			res.status(200).json({ message: "Unfollowed successfully", isFollowing: false });
		} else {
			// TRƯỜNG HỢP: FOLLOW
			const follow = await Follow.create({
				followerId: follower._id,
				followingId,
			});

			// Tạo thông báo Follow
			await Notification.create({
				userId: followingId, // Gửi đến người được follow
				message: `${follower.fullName} started following you!`,
				type: "follow",
				relatedId: follower._id,
			});

			res.status(201).json({ ...follow.toJSON(), isFollowing: true });
		}
	} catch (error) {
		console.log("Error in toggleFollow", error);
		next(error);
	}
};

export const deleteFollow = async (req, res, next) => {
	try {
		await Follow.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Follow deleted" });
	} catch (error) {
		next(error);
	}
};
